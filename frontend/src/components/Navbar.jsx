import React from 'react';
import { Search, MapPin } from 'lucide-react';

const Navbar = ({ onSearch, onCategoryChange, activeCategory }) => {
  const categories = [
    { id: '', label: 'All Places' },
    { id: 'education', label: 'Education' },
    { id: 'health', label: 'Health' },
    { id: 'transport', label: 'Transport' },
    { id: 'factory', label: 'Factory' },
    { id: 'hotel', label: 'Hotel' },
  ];

  return (
    <nav className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-emerald-300" />
            <span className="font-bold text-xl tracking-tight hidden sm:block">Debre Berhan Navigator</span>
            <span className="font-bold text-xl tracking-tight sm:hidden">DB Nav</span>
          </div>
          
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-emerald-300" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-emerald-600 rounded-md leading-5 bg-emerald-800 text-emerald-100 placeholder-emerald-400 focus:outline-none focus:bg-white focus:text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-white transition-colors sm:text-sm"
                placeholder="Search places, categories, kebele..."
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="bg-emerald-800 overflow-x-auto hide-scrollbar border-t border-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
