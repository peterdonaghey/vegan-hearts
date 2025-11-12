'use client';

import { useState } from 'react';
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Subscriber {
  email: string;
  name?: string;
  timestamp: number;
  signupDate: string;
  source: string;
  unsubscribed: boolean;
}

interface SubscribersTableProps {
  subscribers: Subscriber[];
  onToggleStatus: (subscriber: Subscriber) => void;
  onDelete: (subscribers: Subscriber[]) => void;
}

export default function SubscribersTable({
  subscribers,
  onToggleStatus,
  onDelete,
}: SubscribersTableProps) {
  const [selectedSubscribers, setSelectedSubscribers] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<'email' | 'signupDate' | 'source'>('signupDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = subscribers.map((sub) => `${sub.email}-${sub.timestamp}`);
      setSelectedSubscribers(new Set(allKeys));
    } else {
      setSelectedSubscribers(new Set());
    }
  };

  const handleSelectOne = (subscriber: Subscriber, checked: boolean) => {
    const key = `${subscriber.email}-${subscriber.timestamp}`;
    const newSelected = new Set(selectedSubscribers);
    if (checked) {
      newSelected.add(key);
    } else {
      newSelected.delete(key);
    }
    setSelectedSubscribers(newSelected);
  };

  const handleBulkDelete = () => {
    const toDelete = subscribers.filter((sub) =>
      selectedSubscribers.has(`${sub.email}-${sub.timestamp}`)
    );
    onDelete(toDelete);
    setSelectedSubscribers(new Set());
  };

  const handleSort = (field: 'email' | 'signupDate' | 'source') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort subscribers
  const sortedSubscribers = [...subscribers].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'email') {
      comparison = a.email.localeCompare(b.email);
    } else if (sortField === 'signupDate') {
      comparison = new Date(a.signupDate).getTime() - new Date(b.signupDate).getTime();
    } else if (sortField === 'source') {
      comparison = a.source.localeCompare(b.source);
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSource = (source: string) => {
    const sourceMap: Record<string, string> = {
      'landing-page': 'Landing Page',
      'ebook-download': 'Ebook',
      manual: 'Manual',
    };
    return sourceMap[source] || source;
  };

  if (subscribers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">No subscribers found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {selectedSubscribers.size > 0 && (
        <div className="bg-vh-orange/10 px-6 py-3 border-b border-vh-orange/20 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {selectedSubscribers.size} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedSubscribers.size === subscribers.length && subscribers.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-vh-green rounded focus:ring-vh-green"
                />
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-vh-green"
                onClick={() => handleSort('email')}
              >
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-vh-green"
                onClick={() => handleSort('source')}
              >
                Source {sortField === 'source' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-vh-green"
                onClick={() => handleSort('signupDate')}
              >
                Signup Date {sortField === 'signupDate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedSubscribers.map((subscriber) => {
              const key = `${subscriber.email}-${subscriber.timestamp}`;
              const isSelected = selectedSubscribers.has(key);
              
              return (
                <tr
                  key={key}
                  className={`hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-vh-orange/5' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectOne(subscriber, e.target.checked)}
                      className="w-4 h-4 text-vh-green rounded focus:ring-vh-green"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{subscriber.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {subscriber.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-vh-green/10 text-vh-green">
                      {formatSource(subscriber.source)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(subscriber.signupDate)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {subscriber.unsubscribed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                        Unsubscribed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onToggleStatus(subscriber)}
                        className="p-2 text-gray-600 hover:text-vh-green hover:bg-vh-green/10 rounded-lg transition-colors"
                        title={subscriber.unsubscribed ? 'Resubscribe' : 'Unsubscribe'}
                      >
                        {subscriber.unsubscribed ? (
                          <ToggleLeft className="h-5 w-5" />
                        ) : (
                          <ToggleRight className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => onDelete([subscriber])}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
  );
}

