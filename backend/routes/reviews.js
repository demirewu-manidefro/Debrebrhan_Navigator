const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET reviews for a place
router.get('/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM reviews WHERE place_id = $1 ORDER BY created_at DESC',
      [placeId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// POST a new review
router.post('/', async (req, res) => {
  try {
    const { place_id, rating, comment, author_name } = req.body;
    
    if (!place_id || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const insertQuery = `
      INSERT INTO reviews (place_id, rating, comment, author_name)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    
    const values = [place_id, rating, comment || '', author_name || 'Anonymous'];

    const { rows } = await pool.query(insertQuery, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error adding review' });
  }
});

module.exports = router;
