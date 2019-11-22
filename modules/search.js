'use strict';

const superagent = require('superagent');

function Book(book) {
  this.title = book.title || 'No title available';
  this.author = book.authors || 'No author available';
  this.description = book.description || 'No description available';
  this.url = book.imageLinks ? 'https' + book.imageLinks.thumbnail.slice(4) : './img/book-icon.png';
}

exports.searchBook = async function searchBook(req, res) {
  let criteria = req.body.search[1] === 'author' ? 'inauthor' : 'intitle';
  const url = `https://www.googleapis.com/books/v1/volumes?q=${criteria}:${req.body.search[0]}`

  try {
    let result = await superagent.get(url);
    result = result.body.items.map( book => new Book(book.volumeInfo));
    res.status(200).render('pages/searches', {searchArray: result});
  } catch(err) {
    res.status(500).render('pages/error500', {data: err});
  }
};
