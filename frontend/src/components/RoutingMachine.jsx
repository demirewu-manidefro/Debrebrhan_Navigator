import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

// Fix for leaflet-routing-machine in Vite/React
window.L = L;

const RoutingMachine = ({ startCoords, endCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (!startCoords || !endCoords) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(startCoords.lat, startCoords.lng),
        L.latLng(endCoords.lat, endCoords.lng)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: '#059669', opacity: 0.8, weight: 6 }]
      },
      createMarker: function() { return null; } // Don't create default markers for waypoints
    }).addTo(map);

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, startCoords, endCoords]);

  return null;
};

export default RoutingMachine;
