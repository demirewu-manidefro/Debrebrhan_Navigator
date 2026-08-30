async function getHospitals() {
  const query = `[out:json];(way["amenity"="hospital"](9.63, 39.50, 9.73, 39.57);node["amenity"="hospital"](9.63, 39.50, 9.73, 39.57););out center;`;
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(query)
  });
  const data = await res.json();
  const hospitals = data.elements.map(e => ({
    name: e.tags?.name,
    name_en: e.tags?.['name:en'],
    lat: e.lat || e.center?.lat,
    lon: e.lon || e.center?.lon
  }));
  console.log(JSON.stringify(hospitals, null, 2));
}
getHospitals();
