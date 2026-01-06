'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import NewsForm from '../../components/NewsForm';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface NewsArticle {
  newsId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
  isActive: string;
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = async (data: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create article');

      await fetchArticles();
      setShowForm(false);
      // No alert - silent success, user sees new article in list
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateArticle = async (data: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/news', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update article');

      await fetchArticles();
      setShowForm(false);
      setEditingArticle(null);
      // No alert - silent success, user sees updated article in list
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteArticle = async (newsId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/news?newsId=${newsId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete article');

      await fetchArticles();
      // No alert - silent success, article removed from list
    } catch (error) {
      alert('Failed to delete article');
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingArticle(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-2xl text-vh-green font-display">Loading articles...</div>
        </div>
      </AdminLayout>
    );
  }

  if (showForm) {
    return (
      <AdminLayout>
        <NewsForm
          article={editingArticle || undefined}
          onSubmit={editingArticle ? handleUpdateArticle : handleCreateArticle}
          onCancel={handleCancelForm}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-display font-bold text-vh-green">
            Manage News
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-vh-orange text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Article
          </button>
        </div>

        {articles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-xl text-gray-600 mb-6">No articles yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-vh-orange text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create First Article
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-vh-green/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Author
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Publish Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Tags
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {articles.map((article) => {
                    const publishDate = new Date(article.publishDate);
                    const formattedDate = publishDate.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    });

                    return (
                      <tr key={article.newsId} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {article.imageUrl && (
                              <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="font-semibold text-gray-900">
                                {article.title}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {article.excerpt}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {article.author}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {formattedDate}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {article.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-green-50 text-vh-green text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {article.tags.length > 2 && (
                              <span className="px-2 py-1 text-xs text-gray-500">
                                +{article.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(article)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(article.newsId)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

