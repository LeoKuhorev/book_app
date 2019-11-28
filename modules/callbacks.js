'use strict';

const superagent = require('superagent');

// Connecting to DB
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => errorHandler(err, req, res) );

// Object for holding callback functions
const Callback = {};

// Book constructor
function Book(book) {
  this.title = book.title || 'No title available';
  this.author = book.authors || 'No author available';
  this.description = book.description || 'No description available';
  this.url = book.imageLinks ? 'https' + book.imageLinks.thumbnail.slice(4) : '../img/book-icon.png';
  this.isbn = book.industryIdentifiers ? `${book.industryIdentifiers[0].type} ${book.industryIdentifiers[0].identifier}` : 'No isbn available';
}

// Google Books API call
Callback.searchBook = async function searchBook(req, res) {
  let criteria = req.body.search[1] === 'author' ? 'inauthor' : 'intitle';
  const url = `https://www.googleapis.com/books/v1/volumes?q=${criteria}:${req.body.search[0]}`

  try {
    let result = await superagent.get(url);
    if(result.body.totalItems > 0) {
      result = result.body.items.map( book => new Book(book.volumeInfo));
      res.status(200).render('pages/searches/show', {searchArray: result} );
    } else {
      res.status(200).render('pages/searches/show', {
        searchArray: false,
        searchCriteria: req.body.search[0],
        searchType: req.body.search[1]
      } );
    }
  } catch(err) {
    errorHandler(err, req, res);
  }
};

// Showing saved books from database on page load
Callback.showSavedBooks = async function showSavedBooks(req, res) {
  let sql = 'SELECT * FROM books;';
  try {
    let result = await client.query(sql);
    res.status(200).render('pages/index', { sqlResults: result.rows })
  } catch(err) {
    errorHandler(err, req, res);
  }
};

// Rendering detailed view for any chosen book
Callback.showBookDetails = async function showBookDetails(req, res) {
  let sql = 'SELECT * FROM books WHERE id=$1;';
  try {
    let result = await client.query(sql, [req.params.book_id]);
    let bookshelves = await getBookshelves();
    res.status(200).render('pages/books/show', { book: result.rows[0], bookshelves: bookshelves });

  } catch(err) {
    errorHandler(err, req, res);
  }
};

// Saving selected book into database
Callback.saveToDatabase = async function saveToDatabase(req, res) {
  const r = req.body;
  let sql = 'INSERT INTO books (title, author, description, url, isbn, bookshelf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;';
  try {
    let result = await client.query(sql, [r.title, r.author, r.description, r.url, r.isbn, r.bookshelf]);
    sql = 'SELECT * FROM books WHERE id=$1;';
    let id = result.rows[0].id;
    result = await client.query(sql, [id]);
    res.status(200).redirect(`/books/${result.rows[0].id}`);
  } catch(err) {
    errorHandler(err, req, res);
  }
};

// Updating book details
Callback.updateBookDetails = async function updateBookDetails(req, res) {
  const r = req.body;
  let sql = 'UPDATE books SET title=$1, author=$2, description=$3, url=$4, isbn=$5, bookshelf=$6 WHERE id=$7 RETURNING id;';
  try {
    let result = await client.query(sql, [r.title, r.author, r.description, r.url, r.isbn, r.bookshelf, r.id]);
    res.status(200).redirect(`/books/${result.rows[0].id}`);
  } catch(err) {
    errorHandler(err, req, res);
  }
}

// Deleteing book from database
Callback.deleteBook = async function deleteBook(req, res) {
  let sql = 'DELETE FROM books WHERE id=$1;';
  try {
    await client.query(sql, [parseInt(req.body.id)]);
    res.status(200).redirect('/');
  } catch(err) {
    errorHandler(err, req, res);
  }
}

// HELPER FUNCTIONS:
// Generating a sorted list of unique bookshelves
async function getBookshelves() {
  const sql = 'SELECT DISTINCT bookshelf FROM (SELECT bookshelf FROM books ORDER BY LOWER(bookshelf) ASC) as shelves;';
  try {
    let result = await client.query(sql);
    return result.rows.map( cat => cat.bookshelf );
  } catch(err) {
    console.log(err);
  }
}

// Error handler
function errorHandler(err, req, res) {
  res.status(500).render('pages/err/error500', {data: err});
}

// Exporting Callback object
module.exports = Callback;