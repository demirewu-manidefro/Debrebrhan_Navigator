const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/places.json');

// Helper to read data
const getPlaces = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

// GET all places, with optional query filters
router.get('/', (req, res) => {
  try {
    let places = getPlaces();
    const { category, search, kebele } = req.query;

    if (category) {
      places = places.filter(p => p.category === category);
    }
    
    if (kebele) {
      places = places.filter(p => p.kebele === kebele);
    }
    
    if (search) {
      const q = search.toLowerCase();
      places = places.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.name_en.toLowerCase().includes(q)
      );
    }

    res.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ message: 'Server error fetching places' });
  }
});

// POST a new place
router.post('/', (req, res) => {
  try {
    const { name, name_en, category, kebele, lat, lng, landmark, phone } = req.body;
    
    if (!name || !category || !lat || !lng) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const places = getPlaces();
    const newPlace = {
      id: `db_${Date.now()}`,
      name,
      name_en: name_en || '',
      category,
      kebele: kebele || '',
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      landmark: landmark || '',
      phone: phone || ''
    };

    places.push(newPlace);
    fs.writeFileSync(dataPath, JSON.stringify(places, null, 2), 'utf8');

    res.status(201).json(newPlace);
  } catch (error) {
    console.error('Error adding place:', error);
    res.status(500).json({ message: 'Server error adding place' });
  }
});

module.exports = router;
