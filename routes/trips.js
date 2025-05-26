const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Helper functions
function getUsers() {
    try {
        const filePath = path.join(__dirname, '../data', 'users.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log('Error reading users:', error.message);
        return [];
    }
}

function saveUsers(users) {
    try {
        const filePath = path.join(__dirname, '../data', 'users.json');
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.log('Error saving users:', error.message);
        return false;
    }
}

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

// Create new trip for user
router.post('/users/:id/trips', (req, res) => {
    let users = getUsers();
    const userId = parseInt(req.params.id);
    const { name, destinationId, startDate, endDate, budget } = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    // Validate destination exists
    const destinations = getDestinations();
    const destination = destinations.find(d => d.id === parseInt(destinationId));
    if (!destination) {
        return res.status(404).json({
            success: false,
            message: 'Destination not found'
        });
    }
    
    // Create new trip
    const newTrip = {
        id: users[userIndex].trips.length > 0 ? 
            Math.max(...users[userIndex].trips.map(t => t.id)) + 1 : 1,
        name,
        destinationId: parseInt(destinationId),
        startDate,
        endDate,
        budget: parseFloat(budget) || 0,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'planned'
    };
    
    users[userIndex].trips.push(newTrip);
    
    if (saveUsers(users)) {
        res.status(201).json({
            success: true,
            message: 'Trip created successfully',
            data: newTrip
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Error saving trip'
        });
    }
});

// Get user's trips with destination details
router.get('/users/:id/trips', (req, res) => {
    const users = getUsers();
    const destinations = getDestinations();
    const userId = parseInt(req.params.id);
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    // Add destination details to trips
    const tripsWithDetails = user.trips.map(trip => {
        const destination = destinations.find(d => d.id === trip.destinationId);
        return {
            ...trip,
            destination: destination || null
        };
    });
    
    res.json({
        success: true,
        count: tripsWithDetails.length,
        data: tripsWithDetails
    });
});

// Update trip status
router.put('/users/:userId/trips/:tripId', (req, res) => {
    let users = getUsers();
    const userId = parseInt(req.params.userId);
    const tripId = parseInt(req.params.tripId);
    const { status, budget, startDate, endDate } = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    const tripIndex = users[userIndex].trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Trip not found'
        });
    }
    
    // Update trip fields
    if (status) users[userIndex].trips[tripIndex].status = status;
    if (budget) users[userIndex].trips[tripIndex].budget = parseFloat(budget);
    if (startDate) users[userIndex].trips[tripIndex].startDate = startDate;
    if (endDate) users[userIndex].trips[tripIndex].endDate = endDate;
    
    if (saveUsers(users)) {
        res.json({
            success: true,
            message: 'Trip updated successfully',
            data: users[userIndex].trips[tripIndex]
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Error updating trip'
        });
    }
});

// Delete trip
router.delete('/users/:userId/trips/:tripId', (req, res) => {
    let users = getUsers();
    const userId = parseInt(req.params.userId);
    const tripId = parseInt(req.params.tripId);
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    const tripIndex = users[userIndex].trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Trip not found'
        });
    }
    
    // Remove trip
    users[userIndex].trips.splice(tripIndex, 1);
    
    if (saveUsers(users)) {
        res.json({
            success: true,
            message: 'Trip deleted successfully'
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Error deleting trip'
        });
    }
});

module.exports = router;

