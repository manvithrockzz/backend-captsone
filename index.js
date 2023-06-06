// index.js

const express = require('express');
const app = express();
const port = 3000;

// ... existing code

// Add a new route for the health API
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is up and running' });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
