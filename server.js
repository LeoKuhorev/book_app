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

// Connecting to DB
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
app.get('/searches', (req, res) => res.status(200).render('pages/searches/new'));
app.post('/searches', searchBook);
app.get('/books/:book_id', showBookDetails);
app.post('/books', saveToDatabase);

app.get('*', (req, res) => res.status(404).render('pages/err/error404'));



async function showSavedBooks(req, res) {
  let sql = 'SELECT * FROM books;';
  try {
    let result = await client.query(sql);
    res.status(200).render('pages/index', { sqlResults: result.rows })
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

async function saveToDatabase(req, res) {
  const r = req.body;
  let sql = 'INSERT INTO books (title, author, description, url, isbn, bookshelf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;';
  try {
    let result = await client.query(sql, [r.title, r.author, r.description, r.url, r.isbn, r.bookshelf]);
    sql = 'SELECT * FROM books WHERE id=$1;';
    let id = result.rows[0].id;
    result = await client.query(sql, [id]);
    res.status(200).render('pages/books/show', { book: result.rows[0] });
  } catch(err) {
    console.log(err);
  }
}


// Ensure that the server is listening for requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));