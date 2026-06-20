require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Connect to MongoDB
require('./src/models/db');

const notFound = require('./src/middlewares/notFound');

const authRoutes = require('./src/routes/auth');
const cityRoutes = require('./src/routes/city');
const countryRoutes = require('./src/routes/country');
const cultureNoteRoutes = require('./src/routes/cultureNote');
const favoriteRoutes = require('./src/routes/favorite');
const hotelRoutes = require('./src/routes/hotel');
const localGuideRoutes = require('./src/routes/localGuide');
const mosqueRoutes = require('./src/routes/mosque');
const placeRoutes = require('./src/routes/place');
const restaurantRoutes = require('./src/routes/restaurant');
const reviewRoutes = require('./src/routes/review');
const transportOptionRoutes = require('./src/routes/transportOption');
const travelExpenseRoutes = require('./src/routes/travelExpense');
const travelItineraryRoutes = require('./src/routes/travelItinerary');
const userRoutes = require('./src/routes/user');
const visaInfoRoutes = require('./src/routes/visaInfo');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/check', (req, res) => {
  res.json({
    success: true,
    message: 'Travel City Explorer API is running',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Setup uniform router endpoints
app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/culture-notes', cultureNoteRoutes);
app.use('/api/favorite', favoriteRoutes); // keeps matching original frontend
app.use('/api/hotels', hotelRoutes);
app.use('/api/local-guides', localGuideRoutes);
app.use('/api/mosque', mosqueRoutes); // keeps matching original frontend
app.use('/api/places', placeRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/transport-option', transportOptionRoutes); // keeps matching original frontend
app.use('/api/travel-expenses', travelExpenseRoutes);
app.use('/api/travel-itineraries', travelItineraryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/visa-info', visaInfoRoutes);

// 404 handler for unmatched routes
app.use(notFound);

// Centralized error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: null,
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
