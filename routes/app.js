const express = require('express');
const cors = require('cors');
const destinationsRouter = require('./routes/destinations');
const usersRouter = require('./routes/users');
const tripsRouter = require('./routes/trips');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Basic routes
app.get('/', (req, res) => {
    res.send('Hello! Travel Planner Backend is working! 🌍');
});

app.get('/status', (req, res) => {
    res.json({
        message: 'Server is running fine!',
        time: new Date().toLocaleString(),
        developer: 'Mike (Backend Developer - Beginner)'
    });
});

// API Routes
app.use('/api/destinations', destinationsRouter);
app.use('/api/users', usersRouter);
app.use('/api', tripsRouter);

// Error handling
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(port, () => {
    console.log(Travel Planner Server is running on http://localhost:${port});
    console.log('Made by Mike - Backend Developer (Beginner)');
    console.log('\nAvailable endpoints:');
    console.log('GET  /api/destinations - Get all destinations');
    console.log('GET  /api/destinations/:id - Get single destination');
    console.log('GET  /api/destinations/filter/popular - Get popular destinations');
    console.log('GET  /api/destinations/search/:query - Search destinations');
    console.log('GET  /api/users - Get all users');
    console.log('POST /api/users - Create new user');
    console.log('GET  /api/users/:id/favorites - Get user favorites');
    console.log('POST /api/users/:id/favorites - Add to favorites');
    console.log('GET  /api/users/:id/trips - Get user trips');
    console.log('POST /api/users/:id/trips - Create new trip');
    console.log('PUT  /api/users/:userId/trips/:tripId - Update trip');
    console.log('DELETE /api/users/:userId/trips/:tripId - Delete trip');
});

module.exports = app;
