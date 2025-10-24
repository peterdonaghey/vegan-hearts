'use client';

import { useState, FormEvent } from 'react';

export default function EmailSignupForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('🎉 Thank you! Check your email for a welcome message.');
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
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg border-2 border-vh-orange/30 focus:border-vh-orange focus:outline-none focus:ring-2 focus:ring-vh-orange/20 transition-colors disabled:opacity-50"
          required
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-8 py-3 bg-vh-orange text-white rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {status === 'loading' ? 'Joining...' : 'Join Our Journey'}
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
        <p className="text-sm text-gray-500 mt-3">
          Be the first to know when we launch
        </p>
      )}
    </div>
  );
}

