const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

const run = async () => {
  // First, connect to 'postgres' to create 'db_gps' if it doesn't exist
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres',
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${process.env.DB_NAME}'`);
    if (res.rowCount === 0) {
      console.log(`Creating database ${process.env.DB_NAME}...`);
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log('Database created.');
    } else {
      console.log('Database already exists.');
    }
  } catch (err) {
    console.error('Error checking/creating database:', err);
  } finally {
    await client.end();
  }

  // Now connect to 'db_gps' to create table and seed data
  const pool = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  });

  try {
    await pool.connect();
    console.log('Connected to target database.');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS places (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        category VARCHAR(50) NOT NULL,
        kebele VARCHAR(50),
        lat DECIMAL(10, 6) NOT NULL,
        lng DECIMAL(10, 6) NOT NULL,
        landmark VARCHAR(255),
        phone VARCHAR(50)
      );
    `);
    console.log('Table "places" verified/created.');

    // Seed data from JSON
    const data = JSON.parse(fs.readFileSync('./data/places.json', 'utf8'));
    let inserted = 0;
    
    for (const place of data) {
      const exists = await pool.query('SELECT id FROM places WHERE id = $1', [place.id]);
      if (exists.rowCount === 0) {
        await pool.query(
          'INSERT INTO places (id, name, name_en, category, kebele, lat, lng, landmark, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [place.id, place.name, place.name_en || '', place.category, place.kebele || '', place.lat, place.lng, place.landmark || '', place.phone || '']
        );
        inserted++;
      }
    }
    
    console.log(`Seeded ${inserted} new places into PostgreSQL.`);
  } catch (err) {
    console.error('Error setting up table and seeding:', err);
  } finally {
    await pool.end();
  }
};

run();
