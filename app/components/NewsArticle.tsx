'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Calendar, User, Tag } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

// Add styles to ensure paragraph spacing (override Tailwind reset)
const articleStyles = `
  .article-content p {
    margin-bottom: 1em;
  }
  .article-content p:last-child {
    margin-bottom: 0;
  }
  .article-content ul, .article-content ol {
    margin-bottom: 1em;
  }
  .article-content li {
    margin-bottom: 0.5em;
  }
  .article-content h1, .article-content h2, .article-content h3 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  .article-content h1:first-child, 
  .article-content h2:first-child, 
  .article-content h3:first-child {
    margin-top: 0;
  }
  .article-content br {
    display: block;
    content: "";
    margin-top: 1em;
  }
  .article-content img {
    max-width: 800px;
    max-height: 800px;
    width: auto;
    height: auto;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .article-content video {
    max-width: 800px;
    max-height: 800px;
    width: auto;
    height: auto;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
`;

interface NewsArticleProps {
  article: {
    title: string;
    content: string;
    author: string;
    publishDate: string;
    imageUrl?: string;
    videoUrl?: string;
    tags: string[];
  };
}

export default function NewsArticle({ article }: NewsArticleProps) {
  const [sanitizedContent, setSanitizedContent] = useState('');

  useEffect(() => {
    // Sanitize HTML content on client side
    if (typeof window !== 'undefined') {
      const clean = DOMPurify.sanitize(article.content, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3',
          'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
          'a', 'img', 'video', 'source',
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'controls', 'poster', 'type', 'width', 'height'],
      });
      setSanitizedContent(clean);
    }
  }, [article.content]);

  const publishDate = new Date(article.publishDate);
  const formattedDate = publishDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      {/* Inject custom styles for article content */}
      <style dangerouslySetInnerHTML={{ __html: articleStyles }} />
      
      <article className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-vh-green mb-6">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-vh-orange" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-vh-orange" />
            <span>By {article.author}</span>
          </div>
        </div>

        {article.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="h-5 w-5 text-vh-orange" />
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-green-50 text-vh-green text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Article Content - Restore default browser styles that Tailwind resets */}
      <div
        className="ql-container ql-snow article-content"
        style={{
          border: 'none',
          fontSize: '16px',
        }}
      >
        <div
          className="ql-editor"
          style={{
            padding: 0,
          }}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>
    </article>
    </>
  );
}

