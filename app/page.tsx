'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import UnifiedFeed from "./components/UnifiedFeed";
import GoodNews, { defaultGoodNews } from "./components/GoodNews";
import dynamic from "next/dynamic";

const SanctuaryMap = dynamic(
  () => import("@/app/components/SanctuaryMap"),
  { ssr: false }
);

export default function Home() {
  const [downloadCount, setDownloadCount] = useState<number | null>(null);
  const [thankYou, setThankYou] = useState(false);

  useEffect(() => {
    fetch('/api/download-ebook?count')
      .then((res) => res.json())
      .then((data) => setDownloadCount(data.count))
      .catch(() => {});
  }, []);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    // Optimistically bump count
    setDownloadCount((prev) => (prev ?? 0) + 1);
    setThankYou(true);

    // Fire counter increment in background
    fetch('/api/download-ebook?increment')
      .then((res) => res.json())
      .then((data) => {
        if (data.count) setDownloadCount(data.count);
      })
      .catch(() => {});

    // Show thank-you briefly, then open PDF
    setTimeout(() => {
      window.open(
        'https://vegan-hearts-public-files.s3.us-east-1.amazonaws.com/ebooks/awakening-your-vegan-heart-21-days.pdf',
        '_blank'
      );
    }, 600);
  };
  return (
    <>
      {/* <Navigation /> */}
      <main className="min-h-screen ">
      {/* Hero Section with India Mountain Sunset */}
      <section className="relative px-6 pt-8 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://vegan-hearts-assets.s3.us-east-1.amazonaws.com/india-documentary/india-2026-01-03-at-14.00.48.jpg"
            alt="Majestic mountain sunset with silhouetted trees in the foreground"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFAF1]/50 via-30% via-[#FFFAF1]/30 via-70% via-[#FFFAF1]/80 to-[#FFFAF1]"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="VeganHearts Logo"
              width={240}
              height={240}
              className="drop-shadow-2xl bg-white/50 rounded-full p-4 hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-medium text-vh-green mb-6 leading-tight">
            Hello Friend!
          </h1>

          <p className="text-xl md:text-2xl text-vh-green leading-relaxed mb-4 max-w-3xl mx-auto">
            We are so happy you found this space where everyone is Loved as a living being and precious soul!
          </p>

          <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed mb-6">
            May you be vegan, in transition or just curious what all this is about — we welcome you with open arms to explore and participate!
          </p>

          <div className="max-w-2xl mx-auto mb-10">
            <p className="text-lg md:text-xl text-vh-green/80 leading-relaxed italic">
              You're already part of the Vegan Hearts family. 💚
            </p>
          </div>

          {/* Ebook Download Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border-2 border-vh-orange/40 max-w-lg mx-auto">
            {/* Book Cover Thumbnail */}

            <p className="text-xl md:text-2xl font-display font-semibold text-vh-green mb-2">
              🌱 Free Ebook
            </p>
            <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
              Download <strong className="text-vh-orange">Awakening Your Vegan Heart in 21 Days</strong> — a gentle, inspiring guide to compassionate living.
            </p>
            <button
              onClick={handleDownload}
              className="inline-block w-full px-8 py-3 bg-vh-green text-white rounded-lg font-medium hover:bg-vh-green-dark transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              Download Free Ebook
            </button>
            {thankYou && (
              <p className="mt-3 text-sm text-vh-green font-medium animate-pulse">
                Thank you! Downloading your ebook… 💚
              </p>
            )}
            {downloadCount !== null && (
              <p className="mt-1 text-sm text-gray-600">
                Downloaded {downloadCount.toLocaleString()} time{downloadCount !== 1 ? 's' : ''}
              </p>
            )}
              <div className="flex justify-center mt-6">
              <Image
                src="/book-cover.png"
                alt="Awakening Your Vegan Heart in 21 Days book cover"
                width={300}
                height={400}
                className="rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500 ease-out"
                priority
              />
              </div>
          </div>
        </div>
      </section>


      {/* Latest News & Events Section
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-vh-green mb-4">
              Latest Updates
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-vh-orange to-vh-green rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">
              Stay connected with our journey, news, and upcoming events
            </p>
          </div>

          <UnifiedFeed
            limit={6}
            showViewAll={true}
          />
        </div>
      </section>*/}

      {/* <ValuesSection /> */}
      {/* Email Signup Section */}
      {/*<section className="px-6 py-8 ">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-xl md:text-2xl font-display font-bold text-vh-green mb-2">
            Join Our Journey
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-5 leading-relaxed max-w-md mx-auto">
            Receive inspiring updates, course announcements, and community news.
          </p>
          <EmailSignupForm />
        </div>
      </section>*/}
      <GoodNews items={defaultGoodNews} />

      {/* Sanctuary Map Section */}
      <section className="px-6 py-16 bg-[#FFFAF1]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-vh-green mb-3">
              Vegan Hearts Map
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-vh-orange to-vh-green rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A growing map of animal sanctuaries and vegan projects around the world.
              Know a place we should add?
            </p>
          </div>
          <SanctuaryMap
            height="520px"
            className="shadow-xl"
          />
          <p className="text-center mt-4 text-sm text-gray-400">
            Map data &copy; <a href="https://openstreetmap.org" className="text-vh-green/60 hover:text-vh-green">OpenStreetMap</a> contributors &middot; Data manually researched
          </p>
        </div>
      </section>

      <Footer />
    </main>
    </>
  );
}
