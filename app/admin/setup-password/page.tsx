'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';

function SetupPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid link');
    }
  }, [token]);

  const validatePassword = () => {
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/setup-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin');
        }, 3000);
      } else {
        setError(data.error || 'Failed to set password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordChecks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'One number', valid: /[0-9]/.test(password) },
    { label: 'One special character', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFFAF1] to-white px-6">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold text-vh-green mb-4">
            Password Set Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your password has been set. Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFFAF1] to-white px-6">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image 
              src="/logo.png" 
              alt="VeganHearts Logo" 
              width={60} 
              height={60}
              className="rounded-full"
            />
          </Link>
          <h2 className="text-3xl font-display font-bold text-vh-green mb-2">
            Set Your Password
          </h2>
          <p className="text-gray-600">
            Create a secure password for your admin account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting || !token}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent disabled:bg-gray-100"
                placeholder="Enter your password"
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
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting || !token}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent disabled:bg-gray-100"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {password && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">Password requirements:</p>
              <div className="space-y-2">
                {passwordChecks.map((check, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      check.valid ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {check.valid && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                    <span className={`text-sm ${check.valid ? 'text-green-700' : 'text-gray-600'}`}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !token}
            className="w-full px-6 py-3 bg-vh-green text-white rounded-lg hover:bg-vh-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
          >
            {isSubmitting ? 'Setting Password...' : 'Set Password & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SetupPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFFAF1] to-white">
        <div className="text-2xl text-vh-green font-display">Loading...</div>
      </div>
    }>
      <SetupPasswordContent />
    </Suspense>
  );
}

