'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Calendar, User, Tag } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

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
          'a', 'img',
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class'],
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
    <article className="max-w-4xl mx-auto">
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

      {/* Featured Image */}
      {article.imageUrl && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Video */}
      {article.videoUrl && (
        <div className="mb-8">
          <VideoPlayer src={article.videoUrl} poster={article.imageUrl} />
        </div>
      )}

      {/* Article Content */}
      <div
        className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-vh-green prose-p:text-gray-700 prose-a:text-vh-orange prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-lg"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </article>
  );
}

