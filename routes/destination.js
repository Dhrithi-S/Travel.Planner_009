const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Helper function to read destinations
function getDestinations() {
    try {
        const filePath = path.join(__dirname, '../data', 'destinations.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log('Error reading destinations:', error.message);
        return [];
    }
}

// Get all destinations
router.get('/', (req, res) => {
    const destinations = getDestinations();
    res.json({
        success: true,
        count: destinations.length,
        data: destinations
    });
});

// Get single destination by ID
router.get('/:id', (req, res) => {
    const destinations = getDestinations();
    const destination = destinations.find(d => d.id === parseInt(req.params.id));
    
    if (!destination) {
        return res.status(404).json({
            success: false,
            message: 'Destination not found'
        });
    }
    
    res.json({
        success: true,
        data: destination
    });
});

// Get popular destinations only
router.get('/filter/popular', (req, res) => {
    const destinations = getDestinations();
    const popularDestinations = destinations.filter(d => d.popular === true);
    
    res.json({
        success: true,
        count: popularDestinations.length,
        data: popularDestinations
    });
});

// Search destinations by country or name
router.get('/search/:query', (req, res) => {
    const destinations = getDestinations();
    const query = req.params.query.toLowerCase();
    
    const results = destinations.filter(d => 
        d.name.toLowerCase().includes(query) || 
        d.country.toLowerCase().includes(query)
    );
    
    res.json({
        success: true,
        count: results.length,
        query: req.params.query,
        data: results
    });
});

module.exports = router;
