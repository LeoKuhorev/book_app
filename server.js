'use strict';
// Basic server setup
// Load Environment variable from the .env
require('dotenv').config();

// Declare Application Dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const pg = require('pg');

// Application setup
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.urlencoded({extended: true})); //allows working with encoded data from APIs
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);

client.connect();
client.on('error', err => console.log(err));

// Bringing in modules
const Book = require(path.join(__dirname, 'modules', 'search.js'));
const searchBook = Book.searchBook;

// Routes
// Serving static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', showSavedBooks);

app.get('/searches', (req, res) => {
  res.status(200).render('pages/searches/new');
});
app.post('/searches', searchBook);

app.get('/books/:book_id', showBookDetails);


app.get('*', (req, res) => {
  res.status(404).render('pages/err/error404');
});



async function showSavedBooks(req, res) {
  let sql = 'SELECT * FROM books;';
  try {
    let result = await client.query(sql);
    res.render('pages/index', { sqlResults: result.rows })
  } catch(err) {
    console.log(err);
  }
}

async function showBookDetails(req, res) {
  let sql = 'SELECT * FROM books WHERE id=$1;';
  try {
    let result = await client.query(sql, [req.params.book_id]);
    res.status(200).render('pages/books/show', { book: result.rows[0] });
  } catch(err) {
    console.log(err);
  }
}



// Ensure that the server is listening for requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));