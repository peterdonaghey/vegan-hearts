'use client';

import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (email: string, name: string, role: string, sendInvite: boolean, password?: string) => Promise<void>;
}

export default function AddUserModal({
  isOpen,
  onClose,
  onAdd,
}: AddUserModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('admin');
  const [sendInvite, setSendInvite] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate name
    if (!name || name.trim().length === 0) {
      setError('Please enter a name');
      return;
    }

    // Validate password if not sending invite
    if (!sendInvite) {
      if (!password) {
        setError('Password is required when not sending invite email');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setError('Password must contain at least one uppercase letter');
        return;
      }
      if (!/[a-z]/.test(password)) {
        setError('Password must contain at least one lowercase letter');
        return;
      }
      if (!/[0-9]/.test(password)) {
        setError('Password must contain at least one number');
        return;
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        setError('Password must contain at least one special character');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onAdd(email, name, role, sendInvite, sendInvite ? undefined : password);
      setEmail('');
      setName('');
      setRole('admin');
      setPassword('');
      setSendInvite(true);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setEmail('');
      setName('');
      setRole('admin');
      setPassword('');
      setSendInvite(true);
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
            Add Admin User
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent disabled:bg-gray-100"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent disabled:bg-gray-100"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent disabled:bg-gray-100"
            >
              <option value="admin">Admin</option>
              {/* Future roles can be added here */}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              All admins have full permissions
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <input
              type="checkbox"
              id="sendInvite"
              checked={sendInvite}
              onChange={(e) => setSendInvite(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 text-vh-green border-gray-300 rounded focus:ring-vh-green"
            />
            <label htmlFor="sendInvite" className="text-sm text-blue-800 cursor-pointer flex-1">
              <strong>Send invitation email</strong> to let user set their own password
            </label>
          </div>

          {!sendInvite && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent disabled:bg-gray-100"
                  placeholder="Set password for user"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Min 8 chars, uppercase, lowercase, number, special character
              </p>
            </div>
          )}

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
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
