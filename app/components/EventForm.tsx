'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import ImageModal from './ImageModal';

interface EventFormProps {
  event?: {
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
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? event.date.slice(0, 16) : '', // Format for datetime-local
    endTime: event?.endTime ? event.endTime.slice(0, 16) : '',
    location: event?.location || '',
    country: event?.country || '',
    isOnline: event?.isOnline || false,
    posterUrl: event?.posterUrl || '',
    registrationUrl: event?.registrationUrl || '',
    registrationMethod: event?.registrationMethod || '',
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(event?.posterUrl || '');
  const [showFullscreen, setShowFullscreen] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/events/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFormData((prev) => ({ ...prev, posterUrl: data.url }));
      setPreviewUrl(data.url);
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData: any = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };

      if (formData.endTime) {
        submitData.endTime = new Date(formData.endTime).toISOString();
      }

      if (event) {
        submitData.eventId = event.eventId;
      }

      await onSubmit(submitData);
    } catch (error) {
      alert('Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl">
      <h2 className="text-3xl font-display font-bold text-vh-green mb-6">
        {event ? 'Edit Event' : 'Create New Event'}
      </h2>

      <div className="space-y-6">
        {/* Poster Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Event Poster *
          </label>
          
          {previewUrl ? (
            <>
              <div className="flex flex-col items-center">
                <div 
                  className="relative max-w-sm rounded-lg overflow-hidden border-2 border-gray-300 cursor-pointer hover:border-vh-green transition-colors group"
                  onClick={() => setShowFullscreen(true)}
                >
                  <Image
                    src={previewUrl}
                    alt="Event poster preview"
                    width={400}
                    height={600}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white bg-black/70 px-4 py-2 rounded-full text-sm transition-opacity">
                      Click to view fullscreen
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl('');
                    setFormData((prev) => ({ ...prev, posterUrl: '' }));
                  }}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove Image
                </button>
              </div>
            </>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-vh-green transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <span className="text-gray-600">
                {uploading ? 'Uploading...' : 'Click to upload poster'}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Event Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green"
            rows={4}
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              End Time (Optional)
            </label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green"
            />
          </div>
        </div>

        {/* Location Type */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isOnline}
              onChange={(e) => setFormData((prev) => ({ ...prev, isOnline: e.target.checked }))}
              className="w-5 h-5 text-vh-green rounded focus:ring-vh-green"
            />
            <span className="text-gray-700 font-medium">This is an online event</span>
          </label>
        </div>

        {/* Location Details */}
        {!formData.isOnline && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Location/City *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green"
                required={!formData.isOnline}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green"
                placeholder="e.g., Spain"
              />
            </div>
          </div>
        )}

        {formData.isOnline && (
          <input
            type="hidden"
            value="Online"
            onChange={(e) => setFormData((prev) => ({ ...prev, location: 'Online' }))}
          />
        )}

        {/* Registration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Registration URL
            </label>
            <input
              type="url"
              value={formData.registrationUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, registrationUrl: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Or Registration Method
            </label>
            <input
              type="text"
              value={formData.registrationMethod}
              onChange={(e) => setFormData((prev) => ({ ...prev, registrationMethod: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vh-green"
              placeholder="e.g., Contact via WhatsApp: +34..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting || !formData.posterUrl}
            className="flex-1 bg-vh-green text-white py-3 rounded-lg font-semibold hover:bg-vh-green-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>

    {/* Fullscreen Modal */}
    {showFullscreen && previewUrl && (
      <ImageModal
        imageUrl={previewUrl}
        alt="Event poster fullscreen"
        onClose={() => setShowFullscreen(false)}
      />
    )}
    </>
  );
}

