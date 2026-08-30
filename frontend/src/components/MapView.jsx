import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation } from 'lucide-react';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for leaflet's default icon path issues with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Create a custom icon for highlighted/AI-found locations
const highlightIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle auto-panning when targetCoords changes
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

const MapView = ({ places, targetCoords, onMapClick }) => {
  // Debre Berhan default center
  const center = [9.6795, 39.5325];

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer center={center} zoom={17} maxZoom={24} className="h-full w-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          maxZoom={24}
          maxNativeZoom={20}
        />
        
        {/* Controls */}
        <AutoPan targetCoords={targetCoords} />
        <MapClickHandler onMapClick={onMapClick} />

        {/* Markers */}
        {places.map((place) => {
          // Check if this is the targeted place
          const isTargeted = targetCoords && 
                             Math.abs(place.lat - targetCoords.lat) < 0.0001 && 
                             Math.abs(place.lng - targetCoords.lng) < 0.0001;

          return (
            <Marker 
              key={place.id} 
              position={[place.lat, place.lng]}
              icon={isTargeted ? highlightIcon : new L.Icon.Default()}
            >
              <Popup className="custom-popup">
                <div className="p-1">
                  <h3 className="font-bold text-lg mb-1">{place.name}</h3>
                  <h4 className="text-sm text-slate-500 mb-2">{place.name_en}</h4>
                  
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full uppercase tracking-wider font-semibold">
                      {place.category}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-800 text-xs rounded-full">
                      Kebele {place.kebele}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 mb-3 border-l-2 border-emerald-400 pl-2">
                    {place.landmark}
                  </p>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    <Navigation className="h-4 w-4" />
                    Navigate Here
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
