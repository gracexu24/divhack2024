const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors'); 

// Enable CORS for all origins (or specify your frontend origin)
//app.use(cors());
// Enable CORS for all origins (you can specify the allowed origin if necessary)
const corsOptions = {
    origin: 'http://localhost:8000', // Set your frontend origin here
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

app.use(cors({
    origin: 'http://localhost:8000',  // Set the origin of your frontend
    methods: ['GET', 'POST'],        // Allow specific HTTP methods
    allowedHeaders: ['Content-Type'] // Allow specific headers (like Content-Type)
  }));
  
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

app.use(express.static('../divhacks2024'));

// A simple in-memory array to store the user list
let users = [];

// POST endpoint to receive the list of users
app.post('/api/users', (req, res) => {
    console.log(req.body); 
    const { user } = req.body;
    
    if (Array.isArray(user) && user.length === 4) {
        // Save the received users list to the server (in-memory)
        users = user;  // You can save this to a database in real-world scenarios
        
        console.log('Received users:', users);
        
        // Respond back to the client
        res.status(200).json({ message: 'Users list saved successfully!', users });
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