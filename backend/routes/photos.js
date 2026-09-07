const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET photos for a place
router.get('/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM photos WHERE place_id = $1 ORDER BY created_at DESC',
      [placeId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ message: 'Server error fetching photos' });
  }
});

// POST a new photo
router.post('/', async (req, res) => {
  try {
    const { place_id, image_url } = req.body;
    
    if (!place_id || !image_url) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const insertQuery = `
      INSERT INTO photos (place_id, image_url)
      VALUES ($1, $2)
      RETURNING *;
    `;
    
    const values = [place_id, image_url];

    const { rows } = await pool.query(insertQuery, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error adding photo:', error);
    res.status(500).json({ message: 'Server error adding photo' });
  }
});

module.exports = router;
