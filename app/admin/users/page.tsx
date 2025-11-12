'use client';

import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import AdminLayout from '@/app/components/AdminLayout';
import UserStats from '@/app/components/UserStats';
import UsersTable from '@/app/components/UsersTable';
import AddUserModal from '@/app/components/AddUserModal';
import EditUserModal from '@/app/components/EditUserModal';
import ConfirmDeleteModal from '@/app/components/ConfirmDeleteModal';

interface User {
  userId: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string | null;
}

interface Stats {
  total: number;
  active: number;
  disabled: number;
  recentlyAdded: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    disabled: 0,
    recentlyAdded: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
    getCurrentUserId();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchQuery]);

  const getCurrentUserId = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.sub);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/admin-users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token expired or invalid - logout and redirect
        localStorage.removeItem('accessToken');
        window.location.href = '/admin';
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setStats(data.stats);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  };

  const handleAddUser = async (email: string, name: string, role: string, sendInvite: boolean, password?: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('/api/admin-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, name, role, sendInvite, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }

    await fetchUsers();
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (userId: string, name: string, role: string, status: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('/api/admin-users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, name, role, status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }

    await fetchUsers();
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    await handleSaveUser(user.userId, user.name, user.role, newStatus);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/admin-users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: selectedUser.userId }),
      });

      if (response.ok) {
        await fetchUsers();
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetPassword = async (user: User) => {
    if (!confirm(`Send password reset email to ${user.email}?`)) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/admin-users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.userId }),
      });

      if (response.ok) {
        alert('Password reset email sent successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send password reset email');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to send password reset email');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-vh-green mb-2">
            Admin Users
          </h1>
          <p className="text-gray-600">
            Manage admin users and permissions
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-2xl text-vh-green font-display">Loading users...</div>
          </div>
        ) : (
          <>
            <UserStats stats={stats} />

            {/* Actions Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-wrap gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-vh-green text-white rounded-lg hover:bg-vh-green/90 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus className="h-4 w-4" />
                Add User
              </button>
            </div>

            {/* Users Table */}
            <UsersTable
              users={filteredUsers}
              currentUserId={currentUserId}
              onEdit={handleEditUser}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteClick}
              onResetPassword={handleResetPassword}
            />
          </>
        )}
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        user={selectedUser}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
        count={1}
        isDeleting={isDeleting}
      />
    </AdminLayout>
  );
}

