'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    // Basic JWT expiration check
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= exp) {
        // Token expired - logout and redirect
        localStorage.removeItem('accessToken');
        setIsAdmin(false);
        window.location.href = '/admin';
      } else {
        setIsAdmin(true);
      }
    } catch (error) {
      // Invalid token - logout and redirect
      localStorage.removeItem('accessToken');
      setIsAdmin(false);
      window.location.href = '/admin';
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAdmin(false);
  };

  return { isAdmin, isLoading, logout, refreshAuth: checkAuth };
}

