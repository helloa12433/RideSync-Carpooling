import React, { useState } from 'react';
import axios from 'axios';
import { MapPin } from 'lucide-react';
import { MAPBOX_TOKEN } from '../hooks/useMapboxRoute';
import type { Location } from '../hooks/useMapboxRoute';

interface LocationSearchProps {
  placeholder: string;
  icon?: React.ReactNode;
  onSelect: (location: Location | null) => void;
}

export function LocationSearch({ placeholder, icon, onSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const searchLocation = async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setSuggestions([]);
      if (text.length === 0) onSelect(null);
      return;
    }
    try {
      const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json`, {
        params: {
          access_token: MAPBOX_TOKEN,
          autocomplete: true,
          limit: 5
        }
      });
      setSuggestions(res.data.features);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (feature: any) => {
    setQuery(feature.place_name);
    setSuggestions([]);
    onSelect({
      name: feature.place_name,
      lng: feature.center[0],
      lat: feature.center[1]
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    }
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
    onSelect(null);
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted">
        {icon || <MapPin className="w-5 h-5" />}
      </div>
      <input
        type="text"
        value={query}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        onChange={(e) => searchLocation(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-12 pr-10 py-3.5 bg-surface/80 backdrop-blur-md border border-border rounded-xl focus:ring-2 focus:ring-primary focus:bg-surface transition-all outline-none text-text placeholder-text-muted font-medium shadow-sm"
        placeholder={placeholder}
      />
      {query && (
        <button 
          type="button"
          onClick={clearInput}
          className="absolute inset-y-0 right-4 flex items-center text-text-muted hover:text-text"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}

      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-surface backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden">
          {suggestions.map((feature) => (
            <li
              key={feature.id}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevents input from losing focus immediately
                handleSelect(feature);
              }}
              className="px-5 py-3.5 hover:bg-surface-elevated cursor-pointer flex items-center gap-3 border-b border-border last:border-0 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-text truncate">{feature.place_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
