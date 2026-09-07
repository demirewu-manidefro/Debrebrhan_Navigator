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
const reviewsRoutes = require('./routes/reviews');
const photosRoutes = require('./routes/photos');
const eventsRoutes = require('./routes/events');

app.use('/api/places', placesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/photos', photosRoutes);
app.use('/api/events', eventsRoutes);

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Debre Berhan API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
