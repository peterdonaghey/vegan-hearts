'use client';

import Image from 'next/image';

export default function ComingSoonPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D4C5B9]">
      <div className="text-center px-6">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="Vegan Hearts Logo"
            width={400}
            height={400}
            priority
            className="mx-auto"
          />
        </div>

        {/* Text */}
        <h1 className="text-4xl md:text-5xl font-light text-[#6B9A6E] leading-relaxed">
          Vegan Hearts is in creation —<br />
          stay tuned with love.
        </h1>
      </div>
    </div>
  );
}
