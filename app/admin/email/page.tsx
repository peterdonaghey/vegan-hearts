'use client';

import { useState } from 'react';
import { Send, Mail, ArrowLeft } from 'lucide-react';
import AdminLayout from '@/app/components/AdminLayout';
import RichTextEditor from '@/app/components/RichTextEditor';
import Link from 'next/link';

const FROM_ADDRESSES = [
  { label: 'Education', email: 'education@veganhearts.org' },
  { label: 'Hello / General', email: 'hello@veganhearts.org' },
  { label: 'Info', email: 'info@veganhearts.org' },
];

export default function AdminEmailPage() {
  const [fromAddress, setFromAddress] = useState('education@veganhearts.org');
  const [toInput, setToInput] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const toAddresses = toInput
      .split(/[,\n]/)
      .map((a) => a.trim())
      .filter(Boolean);

    if (toAddresses.length === 0) {
      setResult({ type: 'error', message: 'Please enter at least one recipient email.' });
      return;
    }

    if (!subject.trim()) {
      setResult({ type: 'error', message: 'Subject is required.' });
      return;
    }

    if (!body.trim()) {
      setResult({ type: 'error', message: 'Email body is required.' });
      return;
    }

    setSending(true);

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/admin-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fromAddress,
          toAddresses,
          subject: subject.trim(),
          body: body.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ type: 'success', message: data.message });
        setToInput('');
        setSubject('');
        setBody('');
      } else {
        setResult({ type: 'error', message: data.error || 'Failed to send email.' });
      }
    } catch (err) {
      setResult({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-4xl font-display font-bold text-vh-green mb-2">
              Compose Email
            </h1>
            <p className="text-gray-600">
              Send professional emails from your VeganHearts addresses
            </p>
          </div>
        </div>

        {/* Compose Form */}
        <form onSubmit={handleSend} className="bg-white rounded-2xl shadow-lg p-8 space-y-6 max-w-2xl">
          {/* From Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              From
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-vh-green focus:border-transparent bg-white appearance-none cursor-pointer"
              >
                {FROM_ADDRESSES.map((addr) => (
                  <option key={addr.email} value={addr.email}>
                    {addr.label} — {addr.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              To
            </label>
            <input
              type="text"
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              placeholder="email@example.com (separate multiple with commas)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-vh-green focus:border-transparent"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject line"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-vh-green focus:border-transparent"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message
            </label>
            <div className="ql-scroll-fix" style={{ overflowAnchor: 'none' }}>
              <RichTextEditor
                value={body}
                onChange={setBody}
                placeholder="Write your message here... You can paste or drag & drop images directly."
                disableVideo={true}
              />
            </div>
          </div>

          {/* Result */}
          {result && (
            <div
              className={`px-4 py-3 rounded-xl text-sm ${
                result.type === 'success'
                  ? 'bg-vh-green/10 text-vh-green border border-vh-green/20'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {result.message}
            </div>
          )}

          {/* Send Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="px-8 py-3 bg-vh-orange text-white rounded-full font-display font-semibold text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className={`h-5 w-5 ${sending ? 'animate-pulse' : ''}`} />
              {sending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
