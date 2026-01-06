'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import NewsArticle from '../../components/NewsArticle';

interface Article {
  newsId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/news/${slug}`);
      if (!response.ok) {
        setError(true);
        return;
      }
      const data = await response.json();
      setArticle(data.article);
    } catch (error) {
      console.error('Failed to fetch article:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-2xl text-vh-green font-display">Loading article...</div>
        </main>
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-16 px-6">
          <div className="mx-auto max-w-4xl py-20 text-center">
            <h1 className="text-4xl font-display font-bold text-vh-green mb-6">
              Article Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The article you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <button
              onClick={() => router.push('/news')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-vh-orange text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to News
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16 bg-gradient-to-b from-white to-[#FFFAF1]">
        {/* Back Button */}
        <div className="px-6 py-8">
          <div className="mx-auto max-w-4xl">
            <button
              onClick={() => router.push('/news')}
              className="inline-flex items-center gap-2 text-vh-green hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Back to News</span>
            </button>
          </div>
        </div>

        {/* Article Content */}
        <section className="px-6 py-8 pb-20">
          <NewsArticle article={article} />
        </section>

        <Footer />
      </main>
    </>
  );
}

