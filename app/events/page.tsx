'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import LocationFilter from '../components/LocationFilter';
import ImageModal from '../components/ImageModal';

interface Event {
  eventId: string;
  title: string;
  description?: string;
  date: string;
  endTime?: string;
  location: string;
  country?: string;
  isOnline: boolean;
  posterUrl: string;
  registrationUrl?: string;
  registrationMethod?: string;
}

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const upcomingResponse = await fetch('/api/events?status=upcoming');
      const upcomingData = await upcomingResponse.json();
      
      const pastResponse = await fetch('/api/events?status=past');
      const pastData = await pastResponse.json();

      setUpcomingEvents(upcomingData.events || []);
      setPastEvents(pastData.events || []);

      // Extract unique countries
      const allEvents = [...upcomingData.events, ...pastData.events];
      const uniqueCountries = Array.from(
        new Set(
          allEvents
            .filter((e: Event) => !e.isOnline && e.country)
            .map((e: Event) => e.country!)
        )
      );
      setCountries(uniqueCountries);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = (events: Event[]) => {
    if (selectedLocation === 'all') return events;
    if (selectedLocation === 'online') {
      return events.filter((e) => e.isOnline);
    }
    return events.filter((e) => e.country?.toLowerCase() === selectedLocation.toLowerCase());
  };

  const filteredUpcoming = filterEvents(upcomingEvents);
  const filteredPast = filterEvents(pastEvents);

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-2xl text-vh-green font-display">Loading events...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative px-6 py-20 overflow-hidden bg-gradient-to-b from-vh-green/5 to-transparent">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-vh-green mb-6">
              Events
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-vh-orange to-vh-green rounded-full mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Join us for gatherings, workshops, and community events that celebrate compassionate living
            </p>
          </div>
        </section>

        {/* Location Filter */}
        {(upcomingEvents.length > 0 || pastEvents.length > 0) && (
          <section className="px-6 py-8 bg-white">
            <div className="mx-auto max-w-6xl">
              <LocationFilter
                selected={selectedLocation}
                onSelect={setSelectedLocation}
                countries={countries}
              />
            </div>
          </section>
        )}

        {/* Upcoming Events */}
        {filteredUpcoming.length > 0 && (
          <section className="px-6 py-16 bg-gradient-to-b from-white to-[#FFFAF1]">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-4xl font-display font-bold text-vh-green mb-8 text-center">
                Upcoming Events
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredUpcoming.map((event) => (
                  <EventCard
                    key={event.eventId}
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* No upcoming events message */}
        {filteredUpcoming.length === 0 && (
          <section className="px-6 py-16 bg-white">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xl text-gray-600">
                {selectedLocation === 'all'
                  ? 'No upcoming events at the moment. Check back soon!'
                  : `No upcoming events in ${selectedLocation === 'online' ? 'online format' : selectedLocation}. Try selecting "All Locations".`}
              </p>
            </div>
          </section>
        )}

        {/* Past Events */}
        {filteredPast.length > 0 && (
          <section className="px-6 py-16 bg-[#FFFAF1]">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-4xl font-display font-bold text-vh-green mb-8 text-center">
                Past Events
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPast.map((event) => (
                  <EventCard
                    key={event.eventId}
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Event Modal */}
        {selectedEvent && (
          <ImageModal
            imageUrl={selectedEvent.posterUrl}
            alt={selectedEvent.title}
            onClose={() => setSelectedEvent(null)}
          />
        )}

        <Footer />
      </main>
    </>
  );
}

