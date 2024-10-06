const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors'); 

// Enable CORS for all origins (or specify your frontend origin)
app.use(cors());

// Example data (in a real app, this could come from a database)
const users = [
    { id: 1, name: "Facebook" },
    { id: 2, name: "Twitter" },
    { id: 3, name: "Tiktok" }
    { id: 4, name: "Instagram" }
];

// Define a GET endpoint
app.get('/api/users', (req, res) => {
    // Respond with the list of users as JSON
    res.json({users});
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});