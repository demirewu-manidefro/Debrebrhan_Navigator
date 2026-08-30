import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'
import Navbar from './components/Navbar'
import MapView from './components/MapView'
import ChatDrawer from './components/ChatDrawer'
import AddPlaceModal from './components/AddPlaceModal'

function App() {
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  
  const [targetCoords, setTargetCoords] = useState(null);
  const [selectedMapCoords, setSelectedMapCoords] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchPlaces = async () => {
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (activeCategory) params.category = activeCategory;
      
      const res = await axios.get('http://localhost:5000/api/places', { params });
      setPlaces(res.data);
    } catch (error) {
      console.error("Error fetching places", error);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchPlaces();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory]);

  const handleMapClick = (latlng) => {
    setSelectedMapCoords(latlng);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden font-sans">
      <Navbar 
        onSearch={setSearchQuery} 
        onCategoryChange={setActiveCategory} 
        activeCategory={activeCategory} 
      />
      
      <div className="flex-1 relative">
        <MapView 
          places={places} 
          targetCoords={targetCoords}
          onMapClick={handleMapClick}
        />
        
        {/* Floating Add Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="absolute bottom-24 right-6 h-14 w-14 bg-white text-emerald-600 rounded-full shadow-xl flex items-center justify-center hover:bg-emerald-50 transition-transform hover:scale-105 z-[400]"
          title="Add new place"
        >
          <Plus className="h-7 w-7" />
        </button>
        
        <ChatDrawer onNavigateToPlace={(coords) => setTargetCoords(coords)} />
      </div>

      <AddPlaceModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        selectedCoords={selectedMapCoords}
        onPlaceAdded={fetchPlaces}
      />
    </div>
  )
}

export default App
