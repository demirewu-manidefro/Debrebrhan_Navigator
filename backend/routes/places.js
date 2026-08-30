const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all places, with optional query filters
router.get('/', async (req, res) => {
  try {
    const { category, search, kebele } = req.query;

    let query = 'SELECT * FROM places WHERE 1=1';
    let params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    if (kebele) {
      query += ` AND kebele = $${paramIndex}`;
      params.push(kebele);
      paramIndex++;
    }
    
    if (search) {
      query += ` AND (LOWER(name) LIKE $${paramIndex} OR LOWER(name_en) LIKE $${paramIndex})`;
      params.push(`%${search.toLowerCase()}%`);
      paramIndex++;
    }

    const { rows } = await pool.query(query, params);
    // Cast numeric types for JS compatibility
    const places = rows.map(r => ({ ...r, lat: parseFloat(r.lat), lng: parseFloat(r.lng) }));

    res.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ message: 'Server error fetching places' });
  }
});

// POST a new place
router.post('/', async (req, res) => {
  try {
    const { name, name_en, category, kebele, lat, lng, landmark, phone } = req.body;
    
    if (!name || !category || !lat || !lng) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newId = `db_${Date.now()}`;
    const insertQuery = `
      INSERT INTO places (id, name, name_en, category, kebele, lat, lng, landmark, phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    
    const values = [
      newId, 
      name, 
      name_en || '', 
      category, 
      kebele || '', 
      parseFloat(lat), 
      parseFloat(lng), 
      landmark || '', 
      phone || ''
    ];

    const { rows } = await pool.query(insertQuery, values);
    
    const newPlace = rows[0];
    newPlace.lat = parseFloat(newPlace.lat);
    newPlace.lng = parseFloat(newPlace.lng);

    res.status(201).json(newPlace);
  } catch (error) {
    console.error('Error adding place:', error);
    res.status(500).json({ message: 'Server error adding place' });
  }
});

module.exports = router;
