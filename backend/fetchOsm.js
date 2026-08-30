const fs = require('fs');

const query = `[out:json];
(
  node["amenity"](9.63, 39.50, 9.73, 39.57);
  node["tourism"](9.63, 39.50, 9.73, 39.57);
  node["shop"](9.63, 39.50, 9.73, 39.57);
);
out body;`;

const url = 'https://overpass-api.de/api/interpreter';

async function fetchOsm() {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'DebreBerhanNavigator/1.0'
      },
      body: 'data=' + encodeURIComponent(query)
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      const text = await response.text();
      console.error(text.substring(0, 500));
      return;
    }

    const data = await response.json();
    const existing = JSON.parse(fs.readFileSync('./data/places.json', 'utf8'));
    
    let added = 0;
    const newPlaces = data.elements.filter(el => el.tags && (el.tags.name || el.tags['name:am'] || el.tags['name:en'])).map(el => {
      let category = 'public';
      const t = el.tags;
      
      if (t.amenity === 'hospital' || t.amenity === 'clinic' || t.amenity === 'pharmacy') category = 'health';
      else if (t.amenity === 'school' || t.amenity === 'university' || t.amenity === 'college' || t.amenity === 'kindergarten') category = 'education';
      else if (t.tourism === 'hotel' || t.tourism === 'guest_house') category = 'hotel';
      else if (t.amenity === 'bus_station' || t.amenity === 'fuel') category = 'transport';
      else if (t.amenity === 'place_of_worship') category = 'church';
      else if (t.shop) category = 'shop';
      else if (t.amenity === 'bank' || t.amenity === 'atm') category = 'public';
      else if (t.amenity === 'restaurant' || t.amenity === 'cafe') category = 'hotel';

      return {
        id: `osm_${el.id}`,
        name: t['name:am'] || t.name || t['name:en'],
        name_en: t['name:en'] || t.name,
        category,
        kebele: '',
        lat: el.lat,
        lng: el.lon,
        landmark: `OSM: ${t.amenity || t.shop || t.tourism || 'Place'}`
      };
    });

    const finalPlaces = [...existing];
    newPlaces.forEach(np => {
      const isDupName = finalPlaces.some(p => (p.name && p.name === np.name) || (p.name_en && p.name_en === np.name_en));
      if (!isDupName) {
        finalPlaces.push(np);
        added++;
      }
    });
    
    fs.writeFileSync('./data/places.json', JSON.stringify(finalPlaces, null, 2));
    console.log(`Successfully fetched OSM data. Added ${added} new places to the database.`);
  } catch (error) {
    console.error("Error fetching OSM data:", error);
  }
}

fetchOsm();
