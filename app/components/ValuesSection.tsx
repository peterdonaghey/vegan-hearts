import Image from "next/image";
import { Heart, Sparkles, Smile } from "lucide-react";

export default function ValuesSection() {
  return (
    <section className="px-6 py-20 bg-[#FFFAF1]">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center text-vh-green mb-4">
          Our Values
        </h2>
        <p className="text-center text-gray-600 mb-12 text-xl">
          What guides us in everything we do
        </p>

        <div className="space-y-12">
          {/* Compassion - Image Right */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-vh-orange rounded-2xl rotate-3 shadow-lg flex-shrink-0">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-vh-orange">
                  Compassion
                </h3>
              </div>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                Loving communication, actions and understanding through empathy for all living beings
              </p>
            </div>
            <div className="relative w-full md:w-80 h-64 rounded-3xl overflow-hidden shadow-xl flex-shrink-0">
              <Image
                src="https://vegan-hearts-assets.s3.us-east-1.amazonaws.com/india-documentary/india-2026-01-03-at-13.16.52.jpg"
                alt="Vibrant pink lotus flower floating on calm water"
                fill
                className="object-cover"
                quality={90}
              />
            </div>
          </div>

          {/* Authenticity - Image Left */}
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-vh-green rounded-2xl -rotate-3 shadow-lg flex-shrink-0">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-vh-green">
                  Authenticity
                </h3>
              </div>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                Living and creating from truth, love and higher purpose
              </p>
            </div>
            <div className="relative w-full md:w-80 h-64 rounded-3xl overflow-hidden shadow-xl flex-shrink-0">
              <Image
                src="/woman-barefoot-city.jpg"
                alt="Being authentically yourself, barefoot and free in the city"
                fill
                className="object-cover"
                quality={90}
              />
            </div>
          </div>

          {/* Joy - Image Right */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-vh-orange to-vh-green rounded-2xl rotate-2 shadow-lg flex-shrink-0">
                  <Smile className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-vh-green">
                  Joy
                </h3>
              </div>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                Thriving together with joy toward our shared vision of peaceful, happy and healthy life for all
              </p>
            </div>
            <div className="relative w-full md:w-80 h-64 rounded-3xl overflow-hidden shadow-xl flex-shrink-0">
              <Image
                src="/outdoor-gathering.jpg"
                alt="Joyful outdoor gathering at sunset"
                fill
                className="object-cover"
                quality={90}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}