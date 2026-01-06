'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import NewsList from '../components/NewsList';

interface NewsArticle {
  newsId: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  tags: string[];
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Failed to fetch news articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (slug: string) => {
    router.push(`/news/${slug}`);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-2xl text-vh-green font-display">Loading news...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative px-6 py-20 overflow-hidden bg-gradient-to-b from-vh-green/5 to-transparent">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-vh-green mb-6">
              News & Updates
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-vh-orange to-vh-green rounded-full mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Stay connected with our journey, updates from the field, and stories of compassion
            </p>
          </div>
        </section>

        {/* News Articles */}
        <section className="px-6 py-16 bg-gradient-to-b from-white to-[#FFFAF1]">
          <div className="mx-auto max-w-6xl">
            <NewsList
              articles={articles}
              variant="full"
              loading={loading}
              onArticleClick={handleArticleClick}
            />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

