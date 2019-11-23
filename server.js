'use strict';
// Basic server setup
// Load Environment variable from the .env
require('dotenv').config();

// Declare Application Dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');

// Application setup
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.urlencoded({extended: true})); //allows working with encoded data from APIs
app.set('view engine', 'ejs');

// Bringing in modules
const Book = require(path.join(__dirname, 'modules', 'search.js'));
const searchBook = Book.searchBook;

// Routes
// Serving static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.status(200).render('pages/index');
});

app.get('/searches', (req, res) => {
  res.status(200).render('pages/searches/new');
});

app.post('/searches', searchBook);

app.get('*', (req, res) => {
  res.status(404).render('pages/err/error404');
});


// Ensure that the server is listening for requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));