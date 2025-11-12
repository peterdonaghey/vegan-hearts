'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const { isAdmin, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFAF1]/80 backdrop-blur-sm border-b border-vh-green/10 min-w-[320px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="VeganHearts Logo" 
              width={40} 
              height={40}
              className="rounded-full"
            />
            <span className="text-lg sm:text-xl font-display font-semibold text-vh-green">VeganHearts</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/" 
              className={`px-5 py-2 rounded-full transition-colors font-medium ${
                pathname === '/' 
                  ? 'bg-vh-orange text-white' 
                  : 'text-gray-700 hover:text-vh-green'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/events" 
              className={`px-5 py-2 rounded-full transition-colors font-medium ${
                pathname === '/events' || pathname?.startsWith('/admin/events')
                  ? 'bg-vh-orange text-white' 
                  : 'text-gray-700 hover:text-vh-green'
              }`}
            >
              Events
            </Link>
            <Link 
              href="/education" 
              className={`px-5 py-2 rounded-full transition-colors font-medium ${
                pathname === '/education' 
                  ? 'bg-vh-orange text-white' 
                  : 'text-gray-700 hover:text-vh-green'
              }`}
            >
              Education
            </Link>
            
            {/* Admin button - only visible when logged in */}
            {!isLoading && isAdmin && (
              <Link 
                href="/admin" 
                className={`px-5 py-2 rounded-full transition-colors font-medium border-2 ${
                  pathname?.startsWith('/admin')
                    ? 'bg-vh-green text-white border-vh-green' 
                    : 'text-vh-green border-vh-green hover:bg-vh-green hover:text-white'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-vh-green hover:bg-vh-green/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
                pathname === '/' 
                  ? 'bg-vh-orange text-white' 
                  : 'text-gray-700 hover:bg-vh-green/10'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/events" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
                pathname === '/events' || pathname?.startsWith('/admin/events')
                  ? 'bg-vh-orange text-white' 
                  : 'text-gray-700 hover:bg-vh-green/10'
              }`}
            >
              Events
            </Link>
            <Link 
              href="/education" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors font-medium ${
                pathname === '/education' 
                  ? 'bg-vh-orange text-white' 
                  : 'text-gray-700 hover:bg-vh-green/10'
              }`}
            >
              Education
            </Link>
            
            {/* Admin button - mobile */}
            {!isLoading && isAdmin && (
              <Link 
                href="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors font-medium border-2 ${
                  pathname?.startsWith('/admin')
                    ? 'bg-vh-green text-white border-vh-green' 
                    : 'text-vh-green border-vh-green hover:bg-vh-green/10'
                }`}
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
