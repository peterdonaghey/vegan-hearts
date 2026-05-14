'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, InboxIcon, Reply, ArrowLeft, RefreshCw, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout from '@/app/components/AdminLayout';
import Link from 'next/link';

interface InboxItem {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
  key: string;
  size: number;
  lastModified: string;
}

export default function AdminInboxPage() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchInbox = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/admin-inbox?limit=50', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/admin';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch inbox');
      const data = await res.json();
      setItems(data.items);
    } catch (err: any) {
      setError(err.message || 'Failed to load inbox');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const parseEmailAddress = (raw: string) => {
    const match = raw.match(/<(.+)>/);
    return match ? match[1] : raw;
  };

  const parseName = (raw: string) => {
    return raw.replace(/<[^>]+>/, '').trim() || parseEmailAddress(raw);
  };

  const buildReplyUrl = (item: InboxItem) => {
    const toEmail = parseEmailAddress(item.from);
    const subject = item.subject.startsWith('Re:') ? item.subject : `Re: ${item.subject}`;
    // We'll navigate to compose with query params
    return `/admin/email?replyTo=${encodeURIComponent(toEmail)}&subject=${encodeURIComponent(subject)}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-4xl font-display font-bold text-vh-green mb-2">
                Inbox
              </h1>
              <p className="text-gray-600">
                Emails received at your @veganhearts.org addresses
              </p>
            </div>
          </div>
          <button
            onClick={fetchInbox}
            disabled={loading}
            className="p-3 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Inbox List */}
        {loading && items.length === 0 ? (
          <div className="text-center py-20">
            <InboxIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-display">Loading inbox...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <InboxIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-display mb-2">No emails yet</p>
            <p className="text-gray-400">
              When someone replies to your @veganhearts.org emails, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Compact row */}
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="w-full text-left px-6 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="p-2 bg-vh-orange/10 rounded-xl flex-shrink-0 mt-1">
                    <Mail className="h-5 w-5 text-vh-orange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-semibold text-gray-900 truncate">
                        {parseName(item.from)}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                        {item.date ? formatDate(item.date) : formatDate(item.lastModified)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 truncate mt-0.5">
                      {item.subject}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      To: {item.to}
                    </p>
                  </div>
                  {expandedId === item.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                  )}
                </button>

                {/* Expanded preview + actions */}
                {expandedId === item.id && (
                  <div className="px-6 pb-4 border-t border-gray-100">
                    <div className="py-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {item.body || <span className="text-gray-400 italic">(no preview available)</span>}
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-gray-100">
                      <Link
                        href={buildReplyUrl(item)}
                        className="flex items-center gap-2 px-4 py-2 bg-vh-green text-white rounded-full text-sm font-semibold hover:bg-vh-green-dark transition-colors"
                      >
                        <Reply className="h-4 w-4" />
                        Reply
                      </Link>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(parseEmailAddress(item.from));
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Copy sender email
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
