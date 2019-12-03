DROP TABLE IF EXISTS books, bookshelves;

CREATE TABLE bookshelves (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author TEXT,
  description TEXT,
  url VARCHAR(255),
  isbn VARCHAR(255),
  bookshelf_id INTEGER NOT NULL,
  FOREIGN KEY (bookshelf_id) REFERENCES bookshelves(id)
);
