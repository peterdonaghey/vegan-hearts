'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface User {
  userId: string;
  email: string;
  name: string;
  role: string;
  status: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userId: string, name: string, role: string, status: string) => Promise<void>;
}

export default function EditUserModal({
  isOpen,
  user,
  onClose,
  onSave,
}: EditUserModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('admin');
  const [status, setStatus] = useState('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setRole(user.role);
      setStatus(user.status);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate name
    if (!name || name.trim().length === 0) {
      setError('Please enter a name');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(user.userId, name, role, status);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-vh-green">
            Edit Admin User
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent disabled:bg-gray-100"
              required
            />
          </div>

          <div>
            <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              id="edit-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent disabled:bg-gray-100"
            >
              <option value="admin">Admin</option>
              {/* Future roles can be added here */}
            </select>
          </div>

          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent disabled:bg-gray-100"
            >
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Disabled users cannot log in
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-vh-green text-white rounded-lg hover:bg-vh-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

