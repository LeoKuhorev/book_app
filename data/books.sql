DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(90),
  author VARCHAR(90),
  description TEXT,
  url VARCHAR(200),
  isbn VARCHAR(100),
  bookshelf VARCHAR(50)
);

INSERT INTO books (title, author, description, url, isbn, bookshelf)
VALUES ('example 1', 'test_author 1', 'test_description 1', './img/book-icon.png', 'test isbn 1', 'test bookshelf 1'),
       ('example 2', 'test_author 2', 'test_description 2', './img/book-icon.png', 'test isbn 2', 'test bookshelf 2');