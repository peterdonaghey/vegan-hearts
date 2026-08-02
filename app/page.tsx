'use client';

import Image from "next/image";
import Footer from "./components/Footer";
import GoodNews, { defaultGoodNews } from "./components/GoodNews";
import dynamic from "next/dynamic";

const SanctuaryMap = dynamic(
  () => import("@/app/components/SanctuaryMap"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <main className="min-h-screen ">
      {/* Hero Section with India Mountain Sunset */}
      <section className="relative px-6 pt-8 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/india-documentary/india-2026-01-03-at-14.00.48.jpg"
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
            <p className="text-xl md:text-2xl font-display font-semibold text-vh-green mb-2">
              🌱 Free Ebook
            </p>
            <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
              Download <strong className="text-vh-orange">Awakening Your Vegan Heart in 21 Days</strong> — a gentle, inspiring guide to compassionate living.
            </p>
            <a
              href="/ebooks/awakening-your-vegan-heart-21-days.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full px-8 py-3 bg-vh-green text-white rounded-lg font-medium hover:bg-vh-green-dark transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer text-center"
            >
              Download Free Ebook
            </a>
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
