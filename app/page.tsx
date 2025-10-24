import Link from "next/link";
import { Heart, Users, BookOpen, Sprout } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-warm-cream to-white">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <Heart className="h-16 w-16 text-leaf-green fill-leaf-green animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-forest-green sm:text-7xl mb-6">
            VeganHearts
          </h1>
          <p className="text-xl text-earth-brown leading-relaxed mb-4">
            Building a compassionate world through vegan education, community, and advocacy
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            We're creating digital infrastructure to support the vegan movement, 
            connect changemakers, and help others open their hearts to animals and the planet.
          </p>
          
          {/* Email Signup Form */}
          <div className="max-w-md mx-auto">
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-leaf-green/30 focus:border-leaf-green focus:outline-none focus:ring-2 focus:ring-leaf-green/20 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-leaf-green text-white rounded-lg font-medium hover:bg-forest-green transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Join Our Journey
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-3">
              Be the first to know when we launch
            </p>
          </div>
        </div>
      </section>

      {/* Featured Course */}
      <section className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-leaf-green/10 to-forest-green/10 rounded-2xl p-8 border-2 border-leaf-green/20">
            <BookOpen className="h-12 w-12 text-leaf-green mb-4" />
            <h2 className="text-3xl font-bold text-forest-green mb-4">
              Opening Your Vegan Heart in 21 Days
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Our foundational course guiding you through a transformative journey 
              toward compassionate living. Learn, grow, and connect with a supportive community.
            </p>
            <p className="text-forest-green font-medium">
              Coming soon
            </p>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-forest-green mb-16">
            Our Mission
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl hover:bg-warm-cream transition-colors">
              <div className="flex justify-center mb-4">
                <BookOpen className="h-12 w-12 text-leaf-green" />
              </div>
              <h3 className="text-2xl font-semibold text-forest-green mb-4">
                Education
              </h3>
              <p className="text-gray-600">
                Sharing knowledge, resources, and courses to help people understand 
                and embrace veganism as a way of life.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl hover:bg-warm-cream transition-colors">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-leaf-green" />
              </div>
              <h3 className="text-2xl font-semibold text-forest-green mb-4">
                Community
              </h3>
              <p className="text-gray-600">
                Building connections between vegans, educators, activists, and anyone 
                curious about compassionate living.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl hover:bg-warm-cream transition-colors">
              <div className="flex justify-center mb-4">
                <Sprout className="h-12 w-12 text-leaf-green" />
              </div>
              <h3 className="text-2xl font-semibold text-forest-green mb-4">
                Advocacy
              </h3>
              <p className="text-gray-600">
                Supporting activism, animal sanctuaries, and initiatives that create 
                real change for animals and the planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="px-6 py-16 bg-forest-green/5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-forest-green mb-12">
            What We're Building
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-leaf-green/10">
              <h3 className="font-semibold text-lg text-forest-green mb-2">Member Profiles & Chat</h3>
              <p className="text-gray-600 text-sm">Connect with like-minded people worldwide</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-leaf-green/10">
              <h3 className="font-semibold text-lg text-forest-green mb-2">Resource Library</h3>
              <p className="text-gray-600 text-sm">Recipes, guides, articles, and educational content</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-leaf-green/10">
              <h3 className="font-semibold text-lg text-forest-green mb-2">Events & Retreats</h3>
              <p className="text-gray-600 text-sm">Discover and organize vegan events globally</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-leaf-green/10">
              <h3 className="font-semibold text-lg text-forest-green mb-2">Vegan Network Hub</h3>
              <p className="text-gray-600 text-sm">Directory of vegan businesses and organizations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-forest-green text-white">
        <div className="mx-auto max-w-4xl text-center">
          <Heart className="h-8 w-8 mx-auto mb-4 fill-white" />
          <p className="text-lg mb-4">
            VeganHearts is a volunteer-led NGO building a more compassionate world
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

