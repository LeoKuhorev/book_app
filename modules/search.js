'use strict';

const superagent = require('superagent');

function Book(book) {
  this.title = book.title || 'No title available';
  this.author = book.authors || 'No author available';
  this.description = book.description || 'No description available';
  this.url = book.imageLinks ? 'https' + book.imageLinks.thumbnail.slice(4) : './img/book-icon.png';
  this.isbn = book.industryIdentifiers ? `${book.industryIdentifiers[0].type} ${book.industryIdentifiers[0].identifier}` : 'No isbn available';
}

exports.searchBook = async function searchBook(req, res) {
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
    res.status(500).render('pages/err/error500', {data: err});
  }
};
