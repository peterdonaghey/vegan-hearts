'use client';

import Image from 'next/image';
import { Calendar, MapPin, User, Tag } from 'lucide-react';

type NewsArticle = {
  type: 'news';
  newsId: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  tags: string[];
};

type Event = {
  type: 'event';
  eventId: string;
  title: string;
  description?: string;
  date: string;
  location: string;
  country?: string;
  isOnline: boolean;
  posterUrl: string;
};

type FeedItem = NewsArticle | Event;

interface UnifiedFeedCardProps {
  item: FeedItem;
  onClick?: () => void;
}

export default function UnifiedFeedCard({ item, onClick }: UnifiedFeedCardProps) {
  const isNews = item.type === 'news';
  
  const imageUrl = isNews ? item.imageUrl : item.posterUrl;
  const date = isNews ? new Date(item.publishDate) : new Date(item.date);
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group relative"
      onClick={onClick}
    >
      {/* Type Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg ${
            isNews ? 'bg-vh-green' : 'bg-vh-orange'
          }`}
        >
          {isNews ? 'News' : 'Event'}
        </span>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="relative w-full h-64">
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            quality={90}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-display font-bold text-vh-green mb-3 line-clamp-2">
          {item.title}
        </h3>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Calendar className="h-4 w-4 text-vh-orange" />
            <span>{formattedDate}</span>
          </div>

          {isNews ? (
            <>
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <User className="h-4 w-4 text-vh-orange" />
                <span>{item.author}</span>
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex items-start gap-2 text-gray-700 text-sm">
                  <Tag className="h-4 w-4 text-vh-orange mt-0.5" />
                  <div className="flex flex-wrap gap-2">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-vh-green/10 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <MapPin className="h-4 w-4 text-vh-orange" />
              <span>
                {item.isOnline ? 'Online' : `${item.location}${item.country ? `, ${item.country}` : ''}`}
              </span>
            </div>
          )}
        </div>

        {/* Description/Excerpt */}
        <p className="text-gray-600 line-clamp-3 mb-4">
          {isNews ? item.excerpt : item.description || ''}
        </p>

        {/* CTA */}
        <div className="flex items-center gap-2 text-vh-orange font-semibold group-hover:gap-3 transition-all">
          <span>{isNews ? 'Read Article' : 'View Event'}</span>
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </div>
  );
}

