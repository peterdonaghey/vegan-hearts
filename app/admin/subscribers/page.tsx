'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import AdminLayout from '@/app/components/AdminLayout';
import SubscriberStats from '@/app/components/SubscriberStats';
import SubscribersTable from '@/app/components/SubscribersTable';
import AddSubscriberModal from '@/app/components/AddSubscriberModal';
import ConfirmDeleteModal from '@/app/components/ConfirmDeleteModal';
import ExportButton from '@/app/components/ExportButton';

interface Subscriber {
  email: string;
  name?: string;
  timestamp: number;
  signupDate: string;
  source: string;
  unsubscribed: boolean;
}

interface Stats {
  total: number;
  active: number;
  unsubscribed: number;
  bySource: {
    'landing-page': number;
    'ebook-download': number;
    manual: number;
  };
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    unsubscribed: 0,
    bySource: { 'landing-page': 0, 'ebook-download': 0, manual: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subscribersToDelete, setSubscribersToDelete] = useState<Subscriber[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [subscribers, searchQuery, sourceFilter, statusFilter]);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/subscribers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.subscribers);
        setStats(data.stats);
      } else {
        console.error('Failed to fetch subscribers');
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...subscribers];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (sub) =>
          sub.email.toLowerCase().includes(query) ||
          sub.name?.toLowerCase().includes(query)
      );
    }

    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter((sub) => sub.source === sourceFilter);
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter((sub) => !sub.unsubscribed);
    } else if (statusFilter === 'unsubscribed') {
      filtered = filtered.filter((sub) => sub.unsubscribed);
    }

    setFilteredSubscribers(filtered);
  };

  const handleAddSubscriber = async (email: string, name: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add subscriber');
    }

    await fetchSubscribers();
  };

  const handleToggleStatus = async (subscriber: Subscriber) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('/api/subscribers', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: subscriber.email,
        timestamp: subscriber.timestamp,
        unsubscribed: !subscriber.unsubscribed,
      }),
    });

    if (response.ok) {
      await fetchSubscribers();
    }
  };

  const handleDeleteClick = (subscribers: Subscriber[]) => {
    setSubscribersToDelete(subscribers);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/subscribers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscribers: subscribersToDelete.map((sub) => ({
            email: sub.email,
            timestamp: sub.timestamp,
          })),
        }),
      });

      if (response.ok) {
        await fetchSubscribers();
        setIsDeleteModalOpen(false);
        setSubscribersToDelete([]);
      }
    } catch (error) {
      console.error('Error deleting subscribers:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-vh-green mb-2">
            Subscribers
          </h1>
          <p className="text-gray-600">
            Manage your email subscriber list
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-2xl text-vh-green font-display">Loading subscribers...</div>
          </div>
        ) : (
          <>
            <SubscriberStats stats={stats} />

            {/* Actions Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-3 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by email or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent"
                  />
                </div>

                {/* Source Filter */}
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent"
                >
                  <option value="all">All Sources</option>
                  <option value="landing-page">Landing Page</option>
                  <option value="ebook-download">Ebook</option>
                  <option value="manual">Manual</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>

              <div className="flex gap-3">
                <ExportButton subscribers={filteredSubscribers} />
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-vh-green text-white rounded-lg hover:bg-vh-green/90 transition-colors flex items-center gap-2 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Add Subscriber
                </button>
              </div>
            </div>

            {/* Subscribers Table */}
            <SubscribersTable
              subscribers={filteredSubscribers}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteClick}
            />
          </>
        )}
      </div>

      {/* Modals */}
      <AddSubscriberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSubscriber}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        count={subscribersToDelete.length}
        isDeleting={isDeleting}
      />
    </AdminLayout>
  );
}

