'use client';

import Image from "next/image";
import { BookOpen, Heart, Mail } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import EbookDownloadForm from "../components/EbookDownloadForm";

export default function EducationPage() {
  const scrollToForm = () => {
    const formSection = document.getElementById('ebook-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative px-6 py-20 overflow-hidden bg-gradient-to-b from-vh-green/5 to-transparent">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-vh-green mb-6">
              Education
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-vh-orange to-vh-green rounded-full mx-auto"></div>
          </div>
        </section>

        {/* 21-Day Journey Section */}
        <section className="px-6 py-20 bg-white">
          <div className="mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/yoga-nature.jpg"
                  alt="Peaceful moment in nature"
                  fill
                  className="object-cover"
                  quality={90}
                />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-vh-orange/10 rounded-2xl">
                    <BookOpen className="h-8 w-8 text-vh-orange" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-vh-green">
                    Begin your 21-day journey into veganism
                  </h2>
                </div>
                
                <p className="text-xl text-gray-700 leading-relaxed">
                  <strong className="text-vh-green font-display">Awakening Your Vegan Heart in 21 Days</strong> is a gentle, inspiring introduction to compassionate, vegan living.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  This program guides you day by day with simple practices, reflections, and heart-opening tools that help you feel more connected to yourself, to animals, and to the world around you.
                </p>
                
                <div className="bg-vh-green/5 rounded-2xl p-6 border-l-4 border-vh-green">
                  <p className="text-lg text-gray-800 leading-relaxed mb-4">
                    The full ebook is <strong className="text-vh-green">completely free</strong> to download.
                  </p>
                  <p className="text-gray-700 mb-6">
                    Just leave your name and email in the form, and you'll receive your download link to begin your 21-day transformation at your own pace.
                  </p>
                </div>
                
                <p className="text-lg text-gray-600 italic mb-6">
                  No pressure, no perfection — simply a warm, supportive path into a kinder, more conscious way of living. 💚
                </p>
                
                <div id="ebook-form">
                  <EbookDownloadForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Become an Educator Section */}
        <section className="px-6 py-20 bg-gradient-to-b from-vh-green/5 to-[#FFFAF1]">
          <div className="mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 order-2 md:order-1">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-vh-green/10 rounded-2xl">
                    <Heart className="h-8 w-8 text-vh-green" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-vh-green">
                    Become a Vegan Hearts Educator
                  </h2>
                </div>
                
                <p className="text-xl text-gray-700 leading-relaxed">
                  Share your light, inspire change, and guide others into compassionate living.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  As a Vegan Hearts Educator, you'll learn how to lead workshops, hold safe and loving spaces, and support people based on our 21-day "Awakening Your Vegan Heart" ebook.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  This path is for those who feel called to teach, uplift communities, and be a gentle voice for animals, sustainability, and conscious living.
                </p>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-vh-green/20">
                  <div className="flex items-start gap-3">
                    <Mail className="h-6 w-6 text-vh-green mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-lg text-gray-800 mb-2">
                        If you feel called to join us or want more information, write to us at:
                      </p>
                      <a 
                        href="mailto:education@vegan-hearts.org" 
                        className="text-xl font-display font-semibold text-vh-orange hover:text-orange-600 transition-colors"
                      >
                        education@vegan-hearts.org
                      </a>
                      <p className="text-gray-600 mt-2">
                        — we'd love to hear from you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl order-1 md:order-2">
                <Image
                  src="/farm-community.jpg"
                  alt="Community gathering at farm"
                  fill
                  className="object-cover"
                  quality={90}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-6 py-16 bg-[#FFFAF1]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-2xl md:text-3xl font-display text-vh-green leading-relaxed">
              Ready to awaken your compassionate heart?
            </p>
            <p className="text-lg text-gray-700 mt-4 mb-8">
              Start your journey today with our free 21-day program
            </p>
            <button 
              onClick={scrollToForm}
              className="px-10 py-4 bg-vh-green text-white rounded-full font-display font-semibold text-xl hover:bg-vh-green-dark transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Get Started Now
            </button>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

