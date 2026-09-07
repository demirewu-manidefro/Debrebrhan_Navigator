const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all active events
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM events ORDER BY start_date ASC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
});

// POST a new event
router.post('/', async (req, res) => {
  try {
    const { title, description, lat, lng, start_date, end_date } = req.body;
    
    if (!title || !lat || !lng || !start_date || !end_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const insertQuery = `
      INSERT INTO events (title, description, lat, lng, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    
    const values = [title, description || '', lat, lng, start_date, end_date];

    const { rows } = await pool.query(insertQuery, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Server error adding event' });
  }
});

module.exports = router;
