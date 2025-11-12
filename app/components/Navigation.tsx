'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFAF1]/80 backdrop-blur-sm border-b border-vh-green/10">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="VeganHearts Logo" 
              width={40} 
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-display font-semibold text-vh-green">VeganHearts</span>
          </Link>
          
          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>
    </nav>
  );
}

