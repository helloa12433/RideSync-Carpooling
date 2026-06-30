import React, { useState, useRef, useEffect } from 'react';
import { usePhoneInput, defaultCountries, parseCountry } from 'react-international-phone';
import { ChevronDown, Search } from 'lucide-react';

interface CustomPhoneInputProps {
  value: string;
  onChange: (phone: string, meta: { country: { dialCode: string; iso2: string }; inputValue: string }) => void;
  defaultCountry?: string;
}

export default function CustomPhoneInput({ value, onChange, defaultCountry = 'us' }: CustomPhoneInputProps) {
  const {
    inputValue,
    handlePhoneValueChange,
    inputRef,
    country,
    setCountry,
  } = usePhoneInput({
    defaultCountry,
    value,
    countries: defaultCountries,
    onChange: (data) => {
      onChange(data.phone, {
        country: { dialCode: data.country.dialCode, iso2: data.country.iso2 },
        inputValue: data.inputValue,
      });
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = defaultCountries.filter((c) => {
    const parsed = parseCountry(c);
    const searchTerm = search.toLowerCase();
    return (
      parsed.name.toLowerCase().includes(searchTerm) ||
      parsed.dialCode.includes(search.replace('+', '')) ||
      parsed.iso2.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="flex w-full relative">
      {/* Country Selector Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center gap-2 pl-4 pr-3 py-3 h-full rounded-l-xl border border-app-border border-r-0 bg-app-surface hover:bg-app-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 z-10 relative"
        >
          <img
            src={`https://flagcdn.com/w20/${country.iso2}.png`}
            alt={country.name}
            className="w-5 h-auto rounded-sm"
          />
          <span className="text-app-text text-base font-medium">+{country.dialCode}</span>
          <ChevronDown className={`w-4 h-4 text-app-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-app-surface border border-app-border rounded-xl shadow-lg z-50 overflow-hidden flex flex-col max-h-80 transition-colors duration-300">
            <div className="p-2 border-b border-app-border bg-app-bg sticky top-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                <input
                  type="text"
                  placeholder="Search country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-app-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-app-surface text-app-text"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-1">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => {
                  const parsed = parseCountry(c);
                  return (
                    <button
                      key={parsed.iso2}
                      type="button"
                      onClick={() => {
                        setCountry(parsed.iso2);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-app-surface-hover transition-colors ${
                        country.iso2 === parsed.iso2 ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-app-text'
                      }`}
                    >
                      <img
                        src={`https://flagcdn.com/w20/${parsed.iso2}.png`}
                        alt={parsed.name}
                        className="w-5 h-auto rounded-sm shadow-sm"
                      />
                      <span className="flex-1 truncate text-sm font-medium">{parsed.name}</span>
                      <span className="text-sm text-app-muted font-medium">+{parsed.dialCode}</span>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-sm text-app-muted text-center">No countries found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Phone Input Field */}
      <input
        type="tel"
        ref={inputRef}
        value={inputValue}
        onChange={handlePhoneValueChange}
        placeholder="(555) 000-0000"
        className="flex-1 min-w-0 w-full pl-4 pr-5 py-3 text-base bg-app-bg text-app-text rounded-r-xl border border-app-border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
      />
    </div>
  );
}
