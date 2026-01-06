'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import VideoPlayer from './VideoPlayer';

interface NewsFormProps {
  article?: {
    newsId: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    publishDate: string;
    imageUrl?: string;
    videoUrl?: string;
    tags: string[];
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function NewsForm({ article, onSubmit, onCancel }: NewsFormProps) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    author: article?.author || '',
    publishDate: article?.publishDate
      ? new Date(article.publishDate).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16), // Auto-set to current date/time
    imageUrl: article?.imageUrl || '',
    videoUrl: article?.videoUrl || '',
    tags: article?.tags?.join(', ') || '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/news/upload-inline', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/news/upload-video', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFormData((prev) => ({ ...prev, videoUrl: data.url }));
    } catch (error) {
      alert('Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.content || !formData.author || !formData.publishDate) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const submitData: any = {
        ...formData,
        publishDate: new Date(formData.publishDate).toISOString(),
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      if (article) {
        submitData.newsId = article.newsId;
      }

      await onSubmit(submitData);
    } catch (error) {
      alert('Failed to save article');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-display font-bold text-vh-green mb-6">
        {article ? 'Edit Article' : 'Create News Article'}
      </h2>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent"
            required
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Excerpt <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent"
            rows={3}
            placeholder="Brief summary for preview cards..."
            required
          />
        </div>

        {/* Content - Rich Text Editor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            placeholder="Write your article here... You can paste or drag & drop images directly into the editor."
          />
        </div>

        {/* Author & Publish Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Publish Date <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.publishDate}
              onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Featured Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Featured Image
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
              <Upload className="h-5 w-5" />
              <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
            </label>
            {formData.imageUrl && (
              <div className="flex items-center gap-2">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="h-12 w-12 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: '' })}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Video (Optional)
          </label>
          {!formData.videoUrl ? (
            <label className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors w-fit">
              <Upload className="h-5 w-5" />
              <span>{uploadingVideo ? 'Uploading video...' : 'Upload Video'}</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                disabled={uploadingVideo}
              />
            </label>
          ) : (
            <div className="space-y-3">
              <div className="max-w-2xl">
                <VideoPlayer src={formData.videoUrl} className="w-full" />
              </div>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm">
                  <Upload className="h-4 w-4" />
                  <span>{uploadingVideo ? 'Uploading...' : 'Replace Video'}</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={uploadingVideo}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, videoUrl: '' })}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove Video
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent"
            placeholder="e.g. Documentary, India, Animals"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-vh-orange text-white rounded-full font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
          disabled={submitting || uploadingImage || uploadingVideo}
        >
          {submitting ? 'Saving...' : article ? 'Update Article' : 'Create Article'}
        </button>
      </div>
    </form>
  );
}

