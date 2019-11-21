'use strict';
// Basic server setup
// Load Environment veriable from the .env
require('dotenv').config();

// Declare Application Dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const path = require('path');

// Application setup
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.set('view engine', 'ejs');


// Routes
// Serving static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.status(200).render('pages/index');
});

app.get('*', (req, res) => {
  res.status(200).render('pages/error');
});

// Ensure that the server is listening for requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));