const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const placesRoutes = require('./routes/places');
const chatRoutes = require('./routes/chat');

app.use('/api/places', placesRoutes);
app.use('/api/chat', chatRoutes);

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Debre Berhan API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
