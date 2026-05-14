'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../components/AdminLayout';
import { Calendar, Users, Newspaper, Mail, InboxIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-vh-green mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Manage your VeganHearts content here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Events Management */}
          <Link href="/admin/events">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-vh-green">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-vh-green/10 rounded-xl group-hover:bg-vh-green group-hover:text-white transition-colors">
                  <Calendar className="h-8 w-8 text-vh-green group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-vh-green">
                  Events
                </h2>
              </div>
              <p className="text-gray-600">
                Create and manage events, upload posters, and track registrations
              </p>
            </div>
          </Link>

          {/* News Management */}
          <Link href="/admin/news">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-purple-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-purple-500/10 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Newspaper className="h-8 w-8 text-purple-600 group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-purple-600">
                  News
                </h2>
              </div>
              <p className="text-gray-600">
                Write and publish news articles with rich text editor
              </p>
            </div>
          </Link>

          {/* Subscribers */}
          <Link href="/admin/subscribers">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-vh-orange">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-vh-orange/10 rounded-xl group-hover:bg-vh-orange group-hover:text-white transition-colors">
                  <Users className="h-8 w-8 text-vh-orange group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-vh-orange">
                  Subscribers
                </h2>
              </div>
              <p className="text-gray-600">
                View and manage email subscribers and mailing list
              </p>
            </div>
          </Link>

          {/* Inbox */}
          <Link href="/admin/inbox">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-blue-500/10 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <InboxIcon className="h-8 w-8 text-blue-600 group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-blue-600">
                  Inbox
                </h2>
              </div>
              <p className="text-gray-600">
                View and reply to emails received at your @veganhearts.org addresses
              </p>
            </div>
          </Link>

          {/* Email */}
          <Link href="/admin/email">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-vh-orange">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-vh-orange/10 rounded-xl group-hover:bg-vh-orange group-hover:text-white transition-colors">
                  <Mail className="h-8 w-8 text-vh-orange group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-vh-orange">
                  Email
                </h2>
              </div>
              <p className="text-gray-600">
                Send professional emails from your VeganHearts addresses
              </p>
            </div>
          </Link>

          {/* Users */}
          <Link href="/admin/users">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-blue-500/10 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Users className="h-8 w-8 text-blue-600 group-hover:text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-blue-600">
                  Users
                </h2>
              </div>
              <p className="text-gray-600">
                Manage admin users and permissions
              </p>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

