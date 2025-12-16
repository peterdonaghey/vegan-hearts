'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function ComingSoon() {
  const [clickCount, setClickCount] = useState(0);
  const lastClickTime = useRef<number>(0);
  const router = useRouter();

  const handleLogoClick = () => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime.current;
    
    // Reset counter if more than 2 seconds between clicks
    if (timeSinceLastClick > 2000) {
      setClickCount(1);
    } else {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      // Redirect after 11 clicks
      if (newCount >= 11) {
        router.push('/main');
      }
    }
    
    lastClickTime.current = now;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#D4C7BA] p-8">
      <div className="max-w-4xl w-full">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <Image 
            src="/logo.png" 
            alt="VeganHearts Logo" 
            width={200} 
            height={200}
            className="drop-shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300"
            priority
            onClick={handleLogoClick}
          />
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-vh-green leading-tight">
            "Vegan Hearts is in creation — stay tuned with love."
          </h1>
        </div>
      </div>
    </main>
  );
}

