'use client';

import Image from 'next/image';
import { Calendar, Tag } from 'lucide-react';

interface NewsCardProps {
  article: {
    newsId: string;
    title: string;
    slug: string;
    excerpt: string;
    author: string;
    publishDate: string;
    imageUrl?: string;
    tags: string[];
  };
  variant?: 'compact' | 'full';
  onClick?: () => void;
}

export default function NewsCard({ article, variant = 'full', onClick }: NewsCardProps) {
  const publishDate = new Date(article.publishDate);
  const formattedDate = publishDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const isCompact = variant === 'compact';

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group ${
        isCompact ? 'flex flex-row' : ''
      }`}
      onClick={onClick}
    >
      {article.imageUrl && (
        <div
          className={`relative ${
            isCompact
              ? 'w-1/3 min-h-[150px]'
              : 'w-full'
          }`}
          style={!isCompact ? { paddingBottom: '56.25%' } : {}}
        >
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            quality={90}
          />
        </div>
      )}

      <div className={isCompact ? 'w-2/3 p-4' : 'p-6'}>
        <h3
          className={`font-display font-bold text-vh-green mb-2 ${
            isCompact ? 'text-lg line-clamp-2' : 'text-2xl mb-3'
          }`}
        >
          {article.title}
        </h3>

        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-vh-orange" />
            <span>{formattedDate}</span>
          </div>
          <span>By {article.author}</span>
        </div>

        {!isCompact && (
          <>
            <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

            {article.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-vh-orange" />
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
          </>
        )}

        {isCompact && (
          <p className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
        )}
      </div>
    </div>
  );
}

