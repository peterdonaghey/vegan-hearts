'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import EmailSignupForm from "./EmailSignupForm";

export default function Footer() {
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Check if we've reached 7 clicks
    if (clickCount + 1 >= 7) {
      setClickCount(0);
      router.push('/admin');
      return;
    }

    // Reset counter after 2 seconds of no clicks
    timerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 2000);
  };

  return (
    <>
      {/* Email Signup Section */}
      <section className="px-6 py-16 bg-gradient-to-br from-vh-orange/10 to-vh-green/10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-vh-green mb-4">
            Join Our Journey
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
            Receive inspiring updates, course announcements, and community news directly to your inbox.
          </p>
          <EmailSignupForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-vh-green text-white py-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Image 
            src="/logo.png" 
            alt="VeganHearts" 
            width={60} 
            height={60}
            className="mx-auto mb-4 brightness-0 invert opacity-90 cursor-pointer select-none"
            onClick={handleLogoClick}
          />
          <p className="text-lg mb-2 font-display font-medium">
            Vegan Hearts
          </p>
          <p className="text-base mb-4 text-white/90">
            A non-profit organization awakening compassion worldwide
          </p>
          <p className="text-sm text-white/70">
            For the animals. For the planet. For each other.
          </p>
          <div className="mt-6 pt-6 border-t border-white/20 text-sm text-white/60">
            <p>© 2025 VeganHearts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

