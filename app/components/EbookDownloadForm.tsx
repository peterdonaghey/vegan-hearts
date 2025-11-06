'use client';

import { useState, FormEvent } from 'react';

export default function EbookDownloadForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/ebook-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('🎉 Check your email for your download link!');
        setName('');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-vh-green/30 focus:border-vh-green focus:outline-none focus:ring-2 focus:ring-vh-green/20 transition-colors disabled:opacity-50"
          required
          disabled={status === 'loading'}
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-vh-green/30 focus:border-vh-green focus:outline-none focus:ring-2 focus:ring-vh-green/20 transition-colors disabled:opacity-50"
          required
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-8 py-3 bg-vh-green text-white rounded-lg font-medium hover:bg-vh-green-dark transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {status === 'loading' ? 'Sending...' : 'Download Free Ebook'}
        </button>
      </form>
      
      {status === 'success' && (
        <p className="text-sm text-vh-green font-medium mt-3 animate-fade-in">
          {message}
        </p>
      )}
      
      {status === 'error' && (
        <p className="text-sm text-red-600 font-medium mt-3">
          {message}
        </p>
      )}
      
      {status === 'idle' && (
        <p className="text-sm text-gray-500 mt-3 text-center">
          No pressure, no perfection 💚
        </p>
      )}
    </div>
  );
}

