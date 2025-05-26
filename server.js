const express = require('express');
const app = express();
const port = 3000;

// Tell express to read JSON data
app.use(express.json());

// Serve static files (for serving frontend files)
app.use(express.static('public'));

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

// Start the server
app.listen(port, () => {
    console.log(Travel Planner Server is running on http://localhost:${port});
    console.log('Made by Mike - Backend Developer (Beginner)');
});

// Export for other files to use
module.exports = app;


