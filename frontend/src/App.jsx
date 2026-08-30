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
  
  const [targetCoords, setTargetCoords] = useState(null);
  const [selectedMapCoords, setSelectedMapCoords] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPickMode, setIsPickMode] = useState(false);

  const fetchPlaces = async () => {
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      
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
  }, [searchQuery]);

  const handleMapClick = (latlng) => {
    if (isPickMode) {
      setSelectedMapCoords(latlng);
      setIsPickMode(false);
      setIsAddModalOpen(true);
    }
  };

  const handlePickOnMap = () => {
    setIsAddModalOpen(false);
    setIsPickMode(true);
  };

  const handlePlaceSelect = (place) => {
    // Zoom and pan map
    setTargetCoords({ lat: place.lat, lng: place.lng });
    // Clear search so all markers return
    setSearchQuery('');
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-slate-50 overflow-hidden font-sans">
      <Navbar 
        searchQuery={searchQuery}
        onSearch={setSearchQuery} 
        places={places}
        onPlaceSelect={handlePlaceSelect}
      />
      
      <div className="flex-1 relative overflow-hidden">
        <MapView 
          places={places} 
          targetCoords={targetCoords}
          onMapClick={handleMapClick}
          isPickMode={isPickMode}
          selectedCoords={selectedMapCoords}
        />
        
        {/* Floating Add Button */}
        {!isPickMode && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="absolute bottom-24 right-6 h-14 w-14 bg-white text-emerald-600 rounded-full shadow-xl flex items-center justify-center hover:bg-emerald-50 transition-transform hover:scale-105 z-[400]"
            title="Add new place"
          >
            <Plus className="h-7 w-7" />
          </button>
        )}
        
        <ChatDrawer onNavigateToPlace={(coords) => setTargetCoords(coords)} />
      </div>

      <AddPlaceModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        selectedCoords={selectedMapCoords}
        onPlaceAdded={fetchPlaces}
        onPickOnMap={handlePickOnMap}
      />
    </div>
  )
}

export default App
