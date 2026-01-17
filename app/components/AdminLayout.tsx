'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { CognitoUser, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';

interface AdminLayoutProps {
  children: ReactNode;
}

function getUserPool() {
  const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  
  if (!userPoolId || !clientId) {
    return null;
  }

  return new CognitoUserPool({
    UserPoolId: userPoolId,
    ClientId: clientId,
  });
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [currentUser, setCurrentUser] = useState<CognitoUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const userPool = getUserPool();
    if (!userPool) {
      setIsLoading(false);
      return;
    }

    const user = userPool.getCurrentUser();
    if (user) {
      user.getSession((err: any, session: any) => {
        if (err || !session.isValid()) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        setIsAuthenticated(true);
        setIsLoading(false);
        
        // Store token in localStorage for API calls
        const accessToken = session.getAccessToken().getJwtToken();
        localStorage.setItem('accessToken', accessToken);
      });
    } else {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const userPool = getUserPool();
    if (!userPool) {
      setError('Cognito configuration is missing');
      return;
    }

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: async (session) => {
        const accessToken = session.getAccessToken().getJwtToken();
        localStorage.setItem('accessToken', accessToken);
        
        // Update last login timestamp in DynamoDB
        try {
          await fetch('/api/admin-users/update-login', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        } catch (error) {
          console.error('Error updating last login:', error);
          // Don't block login on failure
        }
        
        setIsAuthenticated(true);
      },
      onFailure: (err) => {
        setError(err.message || 'Login failed');
      },
      newPasswordRequired: (userAttributes) => {
        setNeedsPasswordChange(true);
        setCurrentUser(cognitoUser);
        setError('');
      },
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) return;

    currentUser.completeNewPasswordChallenge(
      newPassword,
      {},
      {
        onSuccess: async (session) => {
          const accessToken = session.getAccessToken().getJwtToken();
          localStorage.setItem('accessToken', accessToken);
          
          // Update last login timestamp in DynamoDB
          try {
            await fetch('/api/admin-users/update-login', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
          } catch (error) {
            console.error('Error updating last login:', error);
            // Don't block login on failure
          }
          
          setIsAuthenticated(true);
          setNeedsPasswordChange(false);
        },
        onFailure: (err) => {
          setError(err.message || 'Password change failed');
        },
      }
    );
  };

  const handleLogout = () => {
    const userPool = getUserPool();
    if (userPool) {
      const user = userPool.getCurrentUser();
      if (user) {
        user.signOut();
      }
    }
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFFAF1] to-white">
        <div className="text-2xl text-vh-green font-display">Loading...</div>
      </div>
    );
  }

  // Check if Cognito is configured
  const userPool = getUserPool();
  if (!userPool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFFAF1] to-white px-6">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md text-center">
          <h2 className="text-2xl font-display font-bold text-red-600 mb-4">
            Configuration Error
          </h2>
          <p className="text-gray-700 mb-4">
            The admin authentication system is not properly configured.
          </p>
          <p className="text-sm text-gray-600">
            Missing Cognito environment variables. Please contact the administrator.
          </p>
        </div>
      </div>
    );
  }

  if (needsPasswordChange) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFFAF1] to-white px-6">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-display font-bold text-vh-green mb-6 text-center">
            Change Your Password
          </h2>
          
          <p className="text-gray-600 mb-6 text-center">
            Please set a new password to continue
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent"
                required
                minLength={8}
                placeholder="Min 8 characters, uppercase, lowercase, number"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-vh-green text-white py-3 rounded-lg font-semibold hover:bg-vh-green-dark transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFFAF1] to-white px-6">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-display font-bold text-vh-green mb-6 text-center">
            Admin Login
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-vh-green text-white py-3 rounded-lg font-semibold hover:bg-vh-green-dark transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFAF1] to-white">
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image 
                src="/logo.png" 
                alt="VeganHearts Logo" 
                width={40} 
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-display font-semibold text-vh-green">VeganHearts</span>
            </Link>
            <span className="text-sm text-gray-500 font-medium">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            {pathname !== '/admin' && (
              <Link
                href="/admin"
                className="px-4 py-2 text-gray-700 hover:text-vh-green font-medium transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            <Link
              href="/"
              className="px-4 py-2 text-gray-700 hover:text-vh-green font-medium transition-colors"
            >
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-6">
        {children}
      </div>
    </div>
  );
}

