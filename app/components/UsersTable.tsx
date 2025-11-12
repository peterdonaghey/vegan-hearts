'use client';

import { useState } from 'react';
import { Edit2, Trash2, ToggleLeft, ToggleRight, RotateCcw } from 'lucide-react';

interface User {
  userId: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string | null;
}

interface UsersTableProps {
  users: User[];
  currentUserId: string;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
}

export default function UsersTable({
  users,
  currentUserId,
  onEdit,
  onToggleStatus,
  onDelete,
  onResetPassword,
}: UsersTableProps) {
  const [sortField, setSortField] = useState<'name' | 'email' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'name' | 'email' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'email') {
      comparison = a.email.localeCompare(b.email);
    } else if (sortField === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
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

  const formatRole = (role: string) => {
    return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">No admin users found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-vh-green"
                onClick={() => handleSort('name')}
              >
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-vh-green"
                onClick={() => handleSort('email')}
              >
                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Last Login
              </th>
              <th
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-vh-green"
                onClick={() => handleSort('createdAt')}
              >
                Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedUsers.map((user) => {
              const isCurrentUser = user.userId === currentUserId;
              
              return (
                <tr
                  key={user.userId}
                  className={`hover:bg-gray-50 transition-colors ${
                    isCurrentUser ? 'bg-vh-green/5' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-vh-green font-medium">(You)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-vh-green/10 text-vh-green">
                      {formatRole(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 text-gray-600 hover:text-vh-green hover:bg-vh-green/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      
                      {!isCurrentUser && (
                        <>
                          <button
                            onClick={() => onToggleStatus(user)}
                            className="p-2 text-gray-600 hover:text-vh-orange hover:bg-vh-orange/10 rounded-lg transition-colors"
                            title={user.status === 'active' ? 'Disable' : 'Enable'}
                          >
                            {user.status === 'active' ? (
                              <ToggleRight className="h-4 w-4" />
                            ) : (
                              <ToggleLeft className="h-4 w-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => onResetPassword(user)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Reset Password"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => onDelete(user)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
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

