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


      {/* Footer */}
      <footer className="bg-vh-green text-white py-5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Image
            src="/logo.png"
            alt="VeganHearts"
            width={28}
            height={28}
            className="mx-auto mb-2 brightness-0 invert opacity-80 cursor-pointer select-none"
            onClick={handleLogoClick}
          />
          <p className="text-xs font-display font-medium text-white/70">
            Vegan Hearts · A non-profit awakening compassion worldwide
          </p>
        </div>
      </footer>
    </>
  );
}
