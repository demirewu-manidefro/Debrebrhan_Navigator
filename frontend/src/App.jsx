import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'
import Navbar from './components/Navbar'
import MapView from './components/MapView'
import ChatDrawer from './components/ChatDrawer'
import AddPlaceModal from './components/AddPlaceModal'
import PlaceDetailsModal from './components/PlaceDetailsModal'

function App() {
  const [places, setPlaces] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [targetCoords, setTargetCoords] = useState(null);
  const [selectedMapCoords, setSelectedMapCoords] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPickMode, setIsPickMode] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [routingTarget, setRoutingTarget] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const fetchPlaces = async () => {
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.get(`${apiUrl}/places`, { params });
      setPlaces(res.data);
    } catch (error) {
      console.error("Error fetching places", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.get(`${apiUrl}/events`);
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlaces();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchEvents();
  }, []);

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
    setTargetCoords({ lat: place.lat, lng: place.lng });
    setSelectedPlace(place);
    setSearchQuery('');
  };

  const handleNavigate = (place) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setRoutingTarget(place);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location for routing.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans transition-colors">
      <Navbar 
        searchQuery={searchQuery}
        onSearch={setSearchQuery} 
        places={places}
        onPlaceSelect={handlePlaceSelect}
      />
      
      <div className="flex-1 relative overflow-hidden">
        <MapView 
          places={places} 
          events={events}
          targetCoords={targetCoords}
          onMapClick={handleMapClick}
          isPickMode={isPickMode}
          selectedCoords={selectedMapCoords}
          onPlaceClick={handlePlaceSelect}
          routingTarget={routingTarget}
          userLocation={userLocation}
        />
        
        {/* Floating Add Button */}
        {!isPickMode && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="absolute bottom-24 right-6 h-14 w-14 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-full shadow-xl flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-slate-700 transition-transform hover:scale-105 z-[400]"
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

      <PlaceDetailsModal 
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        place={selectedPlace}
        onNavigate={handleNavigate}
      />
    </div>
  )
}

export default App
