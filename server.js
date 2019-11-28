'use strict';
// Basic server setup
// Declare Application Dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override');

// Load Environment variable from the .env
require('dotenv').config();

// Application setup
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.urlencoded({extended: true})); //allows working with encoded data from APIs
app.set('view engine', 'ejs');

// Using middleware to change browser's POST into PUT
app.use(methodOverride( (req, res) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// Importing callback functions
const Callback = require(path.join(__dirname, 'modules', 'callbacks.js'));
const searchBook = Callback.searchBook;
const showSavedBooks = Callback.showSavedBooks;
const showBookDetails = Callback.showBookDetails;
const saveToDatabase = Callback.saveToDatabase;
const updateBookDetails = Callback.updateBookDetails;
const deleteBook = Callback.deleteBook;

// Routes
// Serving static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', showSavedBooks);
app.get('/searches', (req, res) => res.status(200).render('pages/searches/new'));
app.post('/searches', searchBook);
app.post('/books', saveToDatabase);
app.get('/books/:book_id', showBookDetails);
app.put('/books/:book_id', updateBookDetails);
app.delete('/books/:book_id', deleteBook);


app.get('*', (req, res) => res.status(404).render('pages/err/error404'));


// Ensure that the server is listening for requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));