'use client';

import { useState, useEffect } from 'react';
import UnifiedFeedCard from './UnifiedFeedCard';
import Link from 'next/link';

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

interface UnifiedFeedProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function UnifiedFeed({ limit = 6, showViewAll = true }: UnifiedFeedProps) {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);

      // Fetch news and events in parallel
      const [newsResponse, eventsResponse] = await Promise.all([
        fetch('/api/news?limit=10'),
        fetch('/api/events?limit=10'),
      ]);

      const newsData = await newsResponse.json();
      const eventsData = await eventsResponse.json();

      // Add type field to each item
      const newsItems: NewsArticle[] = (newsData.articles || []).map((article: any) => ({
        ...article,
        type: 'news' as const,
      }));

      const eventItems: Event[] = (eventsData.events || []).map((event: any) => ({
        ...event,
        type: 'event' as const,
      }));

      // Merge and sort by date
      const combined = [...newsItems, ...eventItems].sort((a, b) => {
        const dateA = new Date(a.type === 'news' ? a.publishDate : a.date);
        const dateB = new Date(b.type === 'news' ? b.publishDate : b.date);
        return dateB.getTime() - dateA.getTime();
      });

      setFeedItems(combined);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vh-green"></div>
      </div>
    );
  }

  if (feedItems.length === 0) {
    return (
      <div className="text-center py-12 bg-green-50 rounded-2xl">
        <p className="text-gray-600 text-lg">No news or events yet. Check back soon!</p>
      </div>
    );
  }

  const displayItems = limit ? feedItems.slice(0, limit) : feedItems;
  const hasMore = feedItems.length > limit;

  return (
    <div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {displayItems.map((item) => (
          <UnifiedFeedCard
            key={item.type === 'news' ? item.newsId : item.eventId}
            item={item}
            onClick={() => {
              if (item.type === 'news') {
                window.location.href = `/news/${item.slug}`;
              } else {
                // For now, just scroll to events section or open modal
                // You can implement event detail pages later
                window.location.href = '/events';
              }
            }}
          />
        ))}
      </div>

      {showViewAll && hasMore && (
        <div className="text-center mt-8 flex gap-4 justify-center">
          <Link
            href="/news"
            className="inline-block px-8 py-3 bg-vh-green text-white rounded-full font-semibold hover:bg-green-700 transition-colors"
          >
            All News
          </Link>
          <Link
            href="/events"
            className="inline-block px-8 py-3 bg-vh-orange text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            All Events
          </Link>
        </div>
      )}
    </div>
  );
}

