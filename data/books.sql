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
