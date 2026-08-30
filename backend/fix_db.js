const pool = require('./db');

async function fixCoordinates() {
  try {
    // Delete duplicate or completely fake seed data since we now have real OSM data
    await pool.query(`DELETE FROM places WHERE id IN ('db_03', 'db_04', 'db_05', 'db_06', 'db_07', 'db_08', 'db_10', 'db_11', 'db_12')`);
    console.log("Deleted 9 fake seed entries.");

    // Fix the remaining 3 major landmarks with their real-world coordinates in Debre Berhan
    // Debre Berhan University (Main Campus)
    await pool.query(`UPDATE places SET lat = 9.685933, lng = 39.527376 WHERE id = 'db_01'`); 
    // Debre Berhan Comprehensive Specialized Hospital
    await pool.query(`UPDATE places SET lat = 9.680600, lng = 39.534800 WHERE id = 'db_02'`); 
    // Tebarek Hospital
    await pool.query(`UPDATE places SET lat = 9.681600, lng = 39.535200 WHERE id = 'db_09'`); 
    
    console.log("Fixed the coordinates for University and Hospitals.");
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
fixCoordinates();
