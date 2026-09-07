import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { 
  Navigation, 
  Stethoscope, 
  Coffee, 
  Bed, 
  Factory, 
  GraduationCap, 
  Landmark, 
  Bus,
  MapPin,
  Calendar
} from 'lucide-react';
import RoutingMachine from './RoutingMachine';

// Custom icon generator based on category
const createCustomIcon = (category, isTargeted = false) => {
  let bgColor = '#64748B'; // default slate
  let IconComponent = MapPin;

  if (category === 'health') {
    bgColor = '#EF4444'; // Red
  } else if (category === 'hotel') {
    bgColor = '#F59E0B'; // Amber
  } else if (category === 'factory' || category === 'industry') {
    bgColor = '#475569'; // Slate
  } else if (category === 'education') {
    bgColor = '#3B82F6'; // Blue
  } else if (category === 'church' || category === 'religion') {
    bgColor = '#10B981'; // Emerald
  } else if (category === 'transport') {
    bgColor = '#8B5CF6'; // Purple
  } else if (category === 'government' || category === 'public') {
    bgColor = '#6366F1'; // Indigo
  } else if (category === 'event') {
    bgColor = '#EC4899'; // Pink for events
    IconComponent = Calendar;
  }

  // Ring effect for targeted
  const ringClass = isTargeted ? 'ring-4 ring-emerald-300 ring-opacity-50 scale-125' : '';

  const html = renderToString(
    <div style={{ backgroundColor: bgColor }} className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white transition-transform ${ringClass}`}>
      <IconComponent size={16} strokeWidth={2.5} />
    </div>
  );

  return new L.divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle auto-panning and popup opening
const AutoPan = ({ targetCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (targetCoords) {
      map.flyTo([targetCoords.lat, targetCoords.lng], 18, { animate: true, duration: 1.5 });
    }
  }, [targetCoords, map]);
  return null;
};

// Component to handle map clicks for place registration
const MapClickHandler = ({ onMapClick }) => {
  const map = useMap();
  useEffect(() => {
    if (!onMapClick) return;
    const handleMapClick = (e) => {
      onMapClick(e.latlng);
    };
    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, onMapClick]);
  return null;
};

const MapView = ({ places, events = [], targetCoords, onMapClick, isPickMode, selectedCoords, onPlaceClick, routingTarget, userLocation }) => {
  const center = [9.6795, 39.5325];
  const markerRefs = useRef({});

  return (
    <div className={`h-full w-full relative z-0 ${isPickMode ? 'cursor-crosshair' : ''}`}>
      {isPickMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg font-semibold animate-pulse">
          Tap anywhere on the map to pick a location
        </div>
      )}

      <MapContainer center={center} zoom={15} maxZoom={24} className="h-full w-full" zoomControl={true}>
        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          maxZoom={24}
          maxNativeZoom={20}
        />
        
        {/* Controls */}
        <AutoPan targetCoords={targetCoords} />
        <MapClickHandler onMapClick={onMapClick} />
        <RoutingMachine startCoords={userLocation} endCoords={routingTarget} />

        {/* Temporary Selected Marker in Pick Mode */}
        {selectedCoords && (
          <Marker position={[selectedCoords.lat, selectedCoords.lng]} icon={defaultIcon}>
             <Popup>Selected Location</Popup>
          </Marker>
        )}

        {/* Event Markers */}
        {events.map((event) => (
          <Marker 
            key={`event-${event.id}`} 
            position={[event.lat, event.lng]}
            icon={createCustomIcon('event')}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <h3 className="font-bold text-lg mb-1 text-pink-600">{event.title}</h3>
                <p className="text-sm text-slate-700 mb-2">{event.description}</p>
                <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                  <span className="font-semibold block mb-1">Dates:</span>
                  {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Markers clustered */}
        <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
          {places.map((place) => {
            const isTargeted = targetCoords && 
                               Math.abs(place.lat - targetCoords.lat) < 0.0001 && 
                               Math.abs(place.lng - targetCoords.lng) < 0.0001;

            return (
              <Marker 
                key={place.id} 
                position={[place.lat, place.lng]}
                icon={createCustomIcon(place.category, isTargeted)}
                ref={(r) => markerRefs.current[place.id] = r}
                eventHandlers={{
                  click: () => {
                    if (onPlaceClick) {
                      onPlaceClick(place);
                    }
                  },
                }}
              >
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapView;
