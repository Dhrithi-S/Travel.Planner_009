const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Tell express to read JSON data
app.use(express.json());
// Enable CORS for frontend communication
app.use(cors());
// Serve static files (for serving frontend files)
app.use(express.static('public'));

// Helper function to read JSON files
function readJsonFile(filename) {
    try {
        const filePath = path.join(__dirname, 'data', filename);
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log(Error reading ${filename}:, error.message);
        return [];
    }
}

// Helper function to write JSON files
function writeJsonFile(filename, data) {
    try {
        const filePath = path.join(__dirname, 'data', filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.log(Error writing ${filename}:, error.message);
        return false;
    }
}

// Simple route to test if server works
app.get('/', (req, res) => {
    res.send('Hello! Travel Planner Backend is working! 🌍');
});

// Simple route to get server status
app.get('/status', (req, res) => {
    res.json({
        message: 'Server is running fine!',
        time: new Date().toLocaleString(),
        developer: 'Mike (Backend Developer - Beginner)'
    });
});

// Error handling middleware
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start the server
app.listen(port, () => {
    console.log(Travel Planner Server is running on http://localhost:${port});
    console.log('Made by Mike - Backend Developer (Beginner)');
});

// Export for other files to use
module.exports = app;
	

added
