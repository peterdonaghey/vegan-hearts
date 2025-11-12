'use client';

import Image from 'next/image';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

interface EventCardProps {
  event: {
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
  };
  onClick?: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const endDate = event.endTime ? new Date(event.endTime) : null;
  const formattedEndTime = endDate
    ? endDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative w-full" style={{ paddingBottom: '141.4%' }}>
        <Image
          src={event.posterUrl}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          quality={90}
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-display font-bold text-vh-green mb-3">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="h-5 w-5 text-vh-orange" />
            <span>
              {formattedDate} • {formattedTime}
              {formattedEndTime && ` - ${formattedEndTime}`}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="h-5 w-5 text-vh-orange" />
            <span>
              {event.isOnline ? 'Online' : `${event.location}${event.country ? `, ${event.country}` : ''}`}
            </span>
          </div>
        </div>

        {event.description && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {event.description}
          </p>
        )}

        {event.registrationUrl && (
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-vh-orange text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Register Now
            <ExternalLink className="h-4 w-4" />
          </a>
        )}

        {!event.registrationUrl && event.registrationMethod && (
          <p className="text-sm text-gray-600 italic">
            {event.registrationMethod}
          </p>
        )}
      </div>
    </div>
  );
}

