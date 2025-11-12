'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import EventForm from '../../components/EventForm';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface Event {
  eventId: string;
  title: string;
  description: string;
  date: string;
  endTime?: string;
  location: string;
  country?: string;
  isOnline: boolean;
  posterUrl: string;
  registrationUrl?: string;
  registrationMethod?: string;
  isActive: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?status=all');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (data: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create event');

      await fetchEvents();
      setShowForm(false);
      alert('Event created successfully!');
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateEvent = async (data: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update event');

      await fetchEvents();
      setShowForm(false);
      setEditingEvent(null);
      alert('Event updated successfully!');
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/events?eventId=${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete event');

      await fetchEvents();
      alert('Event deleted successfully!');
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-2xl text-vh-green font-display">Loading events...</div>
        </div>
      </AdminLayout>
    );
  }

  if (showForm) {
    return (
      <AdminLayout>
        <EventForm
          event={editingEvent || undefined}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={handleCancelForm}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-display font-bold text-vh-green">
            Manage Events
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-vh-orange text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-xl text-gray-600 mb-6">No events yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-vh-green text-white rounded-full font-semibold hover:bg-vh-green-dark transition-colors"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < new Date();

              return (
                <div
                  key={event.eventId}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-64 h-64 md:h-auto flex-shrink-0">
                      <Image
                        src={event.posterUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      {isPast && (
                        <div className="absolute top-2 left-2 px-3 py-1 bg-gray-500 text-white rounded-full text-sm font-semibold">
                          Past Event
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6">
                      <h3 className="text-2xl font-display font-bold text-vh-green mb-2">
                        {event.title}
                      </h3>

                      <div className="space-y-1 mb-4">
                        <p className="text-gray-700">
                          📅 {eventDate.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-gray-700">
                          📍 {event.isOnline ? 'Online' : `${event.location}${event.country ? `, ${event.country}` : ''}`}
                        </p>
                      </div>

                      {event.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(event)}
                          className="flex items-center gap-2 px-4 py-2 bg-vh-green text-white rounded-lg hover:bg-vh-green-dark transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteEvent(event.eventId)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

