const express = require('express');
const app = express();
const port = 3000;

// Example data (in a real app, this could come from a database)
const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
];

// Define a GET endpoint
app.get('/api/users', (req, res) => {
    // Respond with the list of users as JSON
    res.json({ users });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});