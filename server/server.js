const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors'); 

// Enable CORS for all origins (or specify your frontend origin)
app.use(cors());

// Example data (in a real app, this could come from a database)
/*const users = [
    { id: 1, name: "Facebook" },
    { id: 2, name: "Twitter" },
    { id: 3, name: "Tiktok" }
    { id: 4, name: "Instagram" }
];
*/

// Use body-parser middleware to parse incoming JSON requests
app.use(bodyParser.json());

// A simple in-memory array to store the user list
let users = [];

// POST endpoint to receive the list of users
app.post('/api/users', (req, res) => {
    const { user } = req.body;
    
    if (Array.isArray(user) && users.length === 4) {
        // Save the received users list to the server (in-memory)
        usersList = user;  // You can save this to a database in real-world scenarios
        
        console.log('Received users:', users);
        
        // Respond back to the client
        res.status(200).json({ message: 'Users list saved successfully!', user: users });
    } else {
        res.status(400).json({ message: 'Invalid data, expected an array with 4 elements.' });
    }
});

// Define a GET endpoint
app.get('/api/users', (req, res) => {
    // Respond with the list of users as JSON
    res.json({users});
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});