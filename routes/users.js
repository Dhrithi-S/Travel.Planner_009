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

// Get all users (for admin purposes)
router.get('/', (req, res) => {
    const users = getUsers();
    // Remove passwords from response for security
    const safeUsers = users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
    });
    
    res.json({
        success: true,
        count: safeUsers.length,
        data: safeUsers
    });
});

// Get single user by ID
router.get('/:id', (req, res) => {
    const users = getUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    // Remove password from response
    const { password, ...safeUser } = user;
    
    res.json({
        success: true,
        data: safeUser
    });
});

// Create new user (simple registration)
router.post('/', (req, res) => {
    let users = getUsers();
    const { name, email, password } = req.body;
    
    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and password are required'
        });
    }
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'Email already registered'
        });
    }
    
    // Create new user
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        email,
        password, // In real app, this should be hashed!
        joinDate: new Date().toISOString().split('T')[0],
        favoriteDestinations: [],
        trips: []
    };
    
    users.push(newUser);
    
    if (saveUsers(users)) {
        // Remove password from response
        const { password, ...safeUser } = newUser;
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: safeUser
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Error saving user'
        });
    }
});

// Add destination to user favorites
router.post('/:id/favorites', (req, res) => {
    let users = getUsers();
    const userId = parseInt(req.params.id);
    const { destinationId } = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    // Check if destination exists
    const destinations = getDestinations();
    const destination = destinations.find(d => d.id === parseInt(destinationId));
    if (!destination) {
        return res.status(404).json({
            success: false,
            message: 'Destination not found'
        });
    }
    
    // Add to favorites if not already there
    if (!users[userIndex].favoriteDestinations.includes(parseInt(destinationId))) {
        users[userIndex].favoriteDestinations.push(parseInt(destinationId));
        
        if (saveUsers(users)) {
            res.json({
                success: true,
                message: 'Destination added to favorites',
                favorites: users[userIndex].favoriteDestinations
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error saving favorites'
            });
        }
    } else {
        res.json({
            success: true,
            message: 'Destination already in favorites',
            favorites: users[userIndex].favoriteDestinations
        });
    }
});

// Get user's favorite destinations with details
router.get('/:id/favorites', (req, res) => {
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
    
    // Get full destination details for favorites
    const favoriteDestinations = destinations.filter(d => 
        user.favoriteDestinations.includes(d.id)
    );
    
    res.json({
        success: true,
        count: favoriteDestinations.length,
        data: favoriteDestinations
    });
});

module.exports = router;
