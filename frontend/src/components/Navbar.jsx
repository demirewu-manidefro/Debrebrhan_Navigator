import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ searchQuery, onSearch, places, onPlaceSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    onSearch(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSelect = (place) => {
    setIsDropdownOpen(false);
    onPlaceSelect(place);
  };

  return (
    <nav className="bg-emerald-700 dark:bg-emerald-900 text-white shadow-lg sticky top-0 z-[2000] pt-[max(env(safe-area-inset-top),0.5rem)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-emerald-300" />
            <span className="font-bold text-xl tracking-tight hidden sm:block">Debre Berhan Navigator</span>
            <span className="font-bold text-xl tracking-tight sm:hidden">DB Nav</span>
          </div>
          
          <div className="flex-1 max-w-md mx-4" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-emerald-300" />
              </div>
              <input
                type="text"
                value={searchQuery}
                className="block w-full pl-10 pr-3 py-2 border border-emerald-600 rounded-md leading-5 bg-emerald-800 text-emerald-100 placeholder-emerald-400 focus:outline-none focus:bg-white focus:text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-white transition-colors sm:text-sm"
                placeholder="Search places, categories, kebele..."
                onChange={handleInputChange}
                onFocus={() => { if (searchQuery) setIsDropdownOpen(true); }}
              />
              
              {/* Autocomplete Dropdown */}
              {isDropdownOpen && searchQuery && places.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-2xl overflow-hidden border border-slate-200 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                  {places.slice(0, 8).map((place) => (
                    <button
                      key={place.id}
                      onClick={() => handleSelect(place)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors group flex items-start justify-between"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                          {place.name}
                        </div>
                        {place.name_en && (
                          <div className="text-xs text-slate-500 mt-0.5">{place.name_en}</div>
                        )}
                        <div className="flex gap-2 mt-1.5">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] uppercase font-bold rounded">
                            {place.category}
                          </span>
                          {place.kebele && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded">
                              Kebele {place.kebele}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                        <Navigation className="h-4 w-4" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* No results state */}
              {isDropdownOpen && searchQuery && places.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-md shadow-lg p-4 text-center text-slate-500 dark:text-slate-400 text-sm border border-slate-200 dark:border-slate-700">
                  No places found. Try a different search.
                </div>
              )}
            </div>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-emerald-600 dark:hover:bg-emerald-800 transition-colors ml-2"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-emerald-100" /> : <Moon className="h-5 w-5 text-emerald-100" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
