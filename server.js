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
app.use(express.urlencoded({extended: true})); //allows working with encoded data from APIs
app.set('view engine', 'ejs');

// Routes
// Serving static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.status(200).render('pages/index');
});

app.post('/searches', (req, res) => {
  let criteria = req.body.search[1] === 'author' ? 'inauthor' : 'intitle';
  const url = `https://www.googleapis.com/books/v1/volumes?q=${criteria}:${req.body.search[0]}`

  superagent.get(url)
    .then(result => result.body.items.map( book => new Book(book)))
    .then(result => res.status(200).render('pages/searches', {searchArray: result}))
    .catch( (err) => console.log('Error!', err));

  function Book(object) {
    this.title = object.volumeInfo.title;
    this.author = object.volumeInfo.authors;
    this.description = object.volumeInfo.description || '';
    this.url = 'https' + object.volumeInfo.imageLinks.thumbnail.slice(4);
  }
});

app.get('*', (req, res) => {
  res.status(200).render('pages/error');
});

// Ensure that the server is listening for requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));