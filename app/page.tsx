import Image from "next/image";
import { Heart, Sparkles, Smile } from "lucide-react";
import EmailSignupForm from "./components/EmailSignupForm";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Forest Background */}
      <section className="relative px-6 pt-8 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/forest-light.jpg" 
            alt="Peaceful forest with sunlight" 
            fill
            className="object-cover object-top"
            priority
            quality={90}
          />
          <div className="bg-blur absolute inset-0 bg-gradient-to-b from-[#FFFAF1]/50 via-30% via-[#FFFAF1]/30 via-70% via-[#FFFAF1]/80 to-[#FFFAF1]"></div>
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
          
          <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed mb-10">
            May you be vegan, in transition or just curious what all this is about - we welcome you with open arms to explore and participate!
          </p>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border-2 border-vh-orange/40 max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-gray-900 leading-relaxed mb-4">
              <strong className="text-vh-orange font-display">Vegan Hearts</strong> is a non-profit organization and project of Love - an invitation to make a positive change in the world. We believe everyone has a compassionate vegan heart - it's just a matter of awakening it.
            </p>
            <p className="text-2xl md:text-3xl font-display font-semibold text-vh-green mt-4">
              Let's veganize the world - because we care!
            </p>
          </div>
        </div>
      </section>

      {/* Community Banner - TALLER */}
      <section className="relative px-6 py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/community-hands.jpg" 
            alt="Diverse community hands together" 
            fill
            className="object-cover object-center"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-vh-green/80 to-vh-orange/70"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="text-4xl md:text-5xl font-display font-bold text-white leading-relaxed drop-shadow-lg">
            Together, we are building a kinder world for all beings
          </p>
        </div>
      </section>

      {/* Mission Section with Collage */}
      <section className="px-6 py-20 bg-gradient-to-b from-white to-[#FFFAF1]">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-8">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-vh-green mb-6">
                Our Mission
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-vh-orange to-vh-green rounded-full mx-auto mb-8"></div>
              
              <p className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8">
                We want to <span className="text-vh-orange font-semibold">awaken and support compassionate living</span> by educating, inspiring, and empowering people and communities to embrace a vegan lifestyle
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-base md:text-lg text-gray-700 mb-12">
                <span className="px-4 py-2 bg-vh-green/10 rounded-full font-medium cursor-default hover:bg-vh-green/20 hover:scale-105 transition-all duration-200">🎓 Training</span>
                <span className="px-4 py-2 bg-vh-green/10 rounded-full font-medium cursor-default hover:bg-vh-green/20 hover:scale-105 transition-all duration-200">🎉 Events</span>
                <span className="px-4 py-2 bg-vh-green/10 rounded-full font-medium cursor-default hover:bg-vh-green/20 hover:scale-105 transition-all duration-200">🌿 Retreats</span>
                <span className="px-4 py-2 bg-vh-green/10 rounded-full font-medium cursor-default hover:bg-vh-green/20 hover:scale-105 transition-all duration-200">🤝 Community Building</span>
                <span className="px-4 py-2 bg-vh-green/10 rounded-full font-medium cursor-default hover:bg-vh-green/20 hover:scale-105 transition-all duration-200">📢 Advocacy</span>
                <span className="px-4 py-2 bg-vh-green/10 rounded-full font-medium cursor-default hover:bg-vh-green/20 hover:scale-105 transition-all duration-200">📖 Storytelling</span>
                <span className="px-4 py-2 bg-vh-green/10 rounded-full font-medium cursor-default hover:bg-vh-green/20 hover:scale-105 transition-all duration-200">🍽️ Vegan Food Projects</span>
                <span className="px-4 py-2 bg-vh-green/10 rounded-full font-medium cursor-default hover:bg-vh-green/20 hover:scale-105 transition-all duration-200">💚 Collaboration</span>
              </div>
              
              <p className="text-lg md:text-xl font-display text-vh-green italic">
                — directly from the heart
              </p>
            </div>

            {/* Image Collage Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-default">
                <Image 
                  src="/veggie-bowl.jpg" 
                  alt="Colorful vegan food" 
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vh-orange/60 to-transparent flex items-end">
                  <p className="text-white font-display font-semibold p-4 text-sm">Food Projects</p>
                </div>
              </div>

              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-default">
                <Image 
                  src="/vegan-festival.jpg" 
                  alt="Community events" 
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vh-green/60 to-transparent flex items-end">
                  <p className="text-white font-display font-semibold p-4 text-sm">Events & Gatherings</p>
                </div>
              </div>

              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-default">
                <Image 
                  src="/yoga-nature.jpg" 
                  alt="Wellness and lifestyle" 
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vh-orange/60 to-transparent flex items-end">
                  <p className="text-white font-display font-semibold p-4 text-sm">Wellbeing & Retreats</p>
                </div>
              </div>

              <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-default">
                <Image 
                  src="/happy-animals.jpg" 
                  alt="Happy animals in sanctuary" 
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vh-green/60 to-transparent flex items-end">
                  <p className="text-white font-display font-semibold p-4 text-sm">Advocacy & Compassion</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/sunrise-mountains-golden.jpg" 
            alt="Golden sunrise over mountains" 
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-white/70"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-vh-green mb-8">
            Our Vision
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-vh-green to-vh-orange rounded-full mx-auto mb-10"></div>
          
          <p className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-6">
            We envision a world <span className="text-vh-green font-semibold">awakened by compassion</span> — where humans, animals, and nature thrive together in harmony.
          </p>
          
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            We seek to open hearts, inspire transformation and unite changemakers to co-create a kinder, more conscious and sustainable world.
          </p>
        </div>
      </section>

      {/* Values Section - Organic Alternating Layout */}
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
                  src="/horse_eye.jpg" 
                  alt="Compassion in the eyes of all beings" 
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

      {/* Email Signup Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-vh-orange/10 to-vh-green/10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-vh-green mb-6">
            Join Our Journey
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Be part of the movement to awaken compassion in the world
          </p>
          <EmailSignupForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-vh-green text-white">
        <div className="mx-auto max-w-4xl text-center">
          <Image 
            src="/logo.png" 
            alt="VeganHearts" 
            width={70} 
            height={70}
            className="mx-auto mb-6 brightness-0 invert opacity-90 "
          />
          <p className="text-xl mb-4 font-display font-medium">
            Vegan Hearts
          </p>
          <p className="text-lg mb-6 text-white/90">
            A non-profit organization awakening compassion worldwide
          </p>
          <p className="text-sm text-white/70">
            For the animals. For the planet. For each other.
          </p>
          <div className="mt-8 pt-8 border-t border-white/20 text-sm text-white/60">
            <p>© 2025 VeganHearts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

