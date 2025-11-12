'use client';

import { useState } from 'react';

interface LocationFilterProps {
  selected: string;
  onSelect: (location: string) => void;
  countries: string[];
}

export default function LocationFilter({ selected, onSelect, countries }: LocationFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => onSelect('all')}
        className={`px-6 py-2 rounded-full font-medium transition-all ${
          selected === 'all'
            ? 'bg-vh-green text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        All Locations
      </button>
      
      <button
        onClick={() => onSelect('online')}
        className={`px-6 py-2 rounded-full font-medium transition-all ${
          selected === 'online'
            ? 'bg-vh-green text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        🌐 Online
      </button>
      
      {countries.map((country) => (
        <button
          key={country}
          onClick={() => onSelect(country)}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            selected === country
              ? 'bg-vh-green text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {country}
        </button>
      ))}
    </div>
  );
}

