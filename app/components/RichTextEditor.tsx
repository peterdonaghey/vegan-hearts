'use client';

import React, { useRef, useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import for React 18 compatible version
let ReactQuill: any = null;
if (typeof window !== 'undefined') {
  const quillModule = require('react-quill-new');
  ReactQuill = quillModule.default || quillModule;

  // Use inline styles instead of CSS classes — critical for email rendering
  const AlignStyle = ReactQuill.Quill.import('attributors/style/align');
  ReactQuill.Quill.register(AlignStyle, true);
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disableVideo?: boolean;
}

export default function RichTextEditor({ value, onChange, placeholder, disableVideo }: RichTextEditorProps) {
  const quillRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Create a loading overlay element for an image
  const createLoadingOverlay = () => {
    const overlay = document.createElement('div');
    overlay.className = 'image-upload-overlay';
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
      width: 24px;
      height: 24px;
      border: 3px solid #e5e7eb;
      border-top-color: #22c55e;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `;
    
    overlay.appendChild(spinner);
    return overlay;
  };

  // Show success checkmark briefly
  const showSuccessIndicator = (wrapper: HTMLElement) => {
    const overlay = wrapper.querySelector('.image-upload-overlay');
    if (overlay) {
      overlay.innerHTML = '<div style="color: #22c55e; font-size: 32px;">✓</div>';
      setTimeout(() => {
        overlay.remove();
      }, 800);
    }
  };

  // Image handler for click to upload
  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      await uploadImageWithPreview(file);
    };
  };

  // Video handler for click to upload
  const videoHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'video/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      await uploadVideoWithPreview(file);
    };
  };

  // Upload image to S3 with instant preview
  const uploadImageWithPreview = async (file: File, base64?: string) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    try {
      // If no base64 provided, generate it
      let imageDataUrl = base64;
      if (!imageDataUrl) {
        imageDataUrl = await fileToBase64(file);
      }

      // Insert base64 image immediately for instant feedback
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', imageDataUrl);
      quill.setSelection(range.index + 1);

      // Add loading overlay to the image
      setTimeout(() => {
        const images = quill.root.querySelectorAll('img');
        const insertedImage = Array.from(images).find((img) => (img as HTMLImageElement).src === imageDataUrl) as HTMLImageElement | undefined;
        
        if (insertedImage) {
          // Wrap image in a container for the overlay
          const wrapper = document.createElement('div');
          wrapper.style.cssText = 'position: relative; display: inline-block;';
          insertedImage.parentNode?.insertBefore(wrapper, insertedImage);
          wrapper.appendChild(insertedImage);
          
          // Add loading overlay
          const overlay = createLoadingOverlay();
          wrapper.appendChild(overlay);

          // Start upload in background
          uploadToS3AndReplace(file, imageDataUrl, wrapper);
        }
      }, 50);

    } catch (error) {
      console.error('Error inserting image:', error);
      alert('Failed to insert image. Please try again.');
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload video with preview
  const uploadVideoWithPreview = async (file: File) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    const uid = `vid-load-${Date.now()}`;

    // Insert a temporary loading placeholder via innerHTML trick that quill won't mangle
    const placeholderHtml = `<p id="${uid}" style="background:#f3f4f6;border:2px dashed #d1d5db;border-radius:8px;padding:16px;text-align:center;color:#6b7280;">⏳ Uploading video...</p>`;
    quill.clipboard.dangerouslyPasteHTML(range.index, placeholderHtml, 'user');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/news/upload-video', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload video');
      }

      const { url } = await response.json();

      // Find the placeholder by ID and replace with video
      const placeholderNode = quill.root.querySelector(`#${uid}`);
      if (placeholderNode) {
        const video = document.createElement('video');
        video.controls = true;
        video.style.cssText = 'max-width:100%;border-radius:8px;';
        video.src = url;
        placeholderNode.replaceWith(video);
      }

    } catch (error) {
      console.error('Error uploading video:', error);
      
      const q = quillRef.current?.getEditor();
      if (q) {
        const placeholderNode = q.root.querySelector(`#${uid}`);
        if (placeholderNode) {
          const errSpan = document.createElement('span');
          errSpan.style.cssText = 'color:#dc2626;font-weight:600;';
          errSpan.textContent = '✕ Video upload failed';
          placeholderNode.replaceWith(errSpan);
        }
      }
      
      alert('Failed to upload video. Please try again.');
    }
  };

  // Upload to S3 and replace base64 with S3 URL
  const uploadToS3AndReplace = async (file: File, base64Url: string, wrapper: HTMLElement) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Get auth token from localStorage - FIXED: use accessToken instead of authToken
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      console.log('Uploading image to S3...');
      const response = await fetch('/api/news/upload-inline', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const { url } = await response.json();
      console.log('Image uploaded successfully:', url);

      // Replace base64 with S3 URL in the content
      const currentContent = quill.root.innerHTML;
      const newContent = currentContent.replace(base64Url, url);
      quill.root.innerHTML = newContent;

      // Show success indicator
      showSuccessIndicator(wrapper);

    } catch (error) {
      console.error('Error uploading image to S3:', error);
      
      // Remove loading overlay and show error indicator
      const overlay = wrapper.querySelector('.image-upload-overlay');
      if (overlay) {
        overlay.innerHTML = '<div style="color: #ef4444; font-size: 18px; background: white; padding: 4px 8px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Upload failed</div>';
        setTimeout(() => {
          overlay.remove();
        }, 2000);
      }
      
      // Note: We keep the base64 image in the editor for now
      // In production, you might want to remove it entirely
      console.warn('Image was not uploaded to S3. Base64 version remains in editor.');
    }
  };

  // Handle paste event to support pasting images
  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          // Generate base64 first for instant display
          const base64 = await fileToBase64(file);
          await uploadImageWithPreview(file, base64);
        }
      }
    }
  };

  // Handle drop event to support drag & drop images
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type.indexOf('image') !== -1) {
      await uploadImageWithPreview(file);
    }
  };

  // Attach paste and drop handlers
  React.useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const editorElement = editor.root;
    editorElement.addEventListener('paste', handlePaste);
    editorElement.addEventListener('drop', handleDrop);

    // Add CSS for spinner animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      editorElement.removeEventListener('paste', handlePaste);
      editorElement.removeEventListener('drop', handleDrop);
      style.remove();
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        disableVideo ? ['link', 'image'] : ['link', 'image', 'video'],
        [{ align: [] }],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
        video: videoHandler,
      },
    },
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: true,
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'blockquote',
    'code-block',
    'link',
    'image',
    ...(disableVideo ? [] : ['video']),
    'align',
  ];

  // Don't render until mounted (client-side only)
  if (!isMounted || !ReactQuill) {
    return (
      <div className="rich-text-editor">
        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .rich-text-editor .ql-editor {
          font-size: 16px;
          line-height: 1.6;
          min-height: 300px;
        }
        .rich-text-editor .ql-editor img {
          max-width: 800px;
          max-height: 800px;
          width: auto;
          height: auto;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        .rich-text-editor .ql-editor video {
          max-width: 800px;
          max-height: 800px;
          width: auto;
          height: auto;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        .rich-text-editor .ql-container {
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }
      `}} />
      <div className="rich-text-editor">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="bg-white"
        />
      </div>
    </>
  );
}

