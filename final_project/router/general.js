const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const exists = users.some((user) => user.username === username);
    if (exists) {
      return res.status(404).json({ message: "User already exists!" });
    } else {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    }
  } else {
    return res.status(404).json({ message: "Unable to register user." });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const formattedBooks = JSON.stringify(books, null, 2);
  res.status(200).type("json").send(formattedBooks);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    const formattedBook = JSON.stringify(book, null, 2);
    res.status(200).type("json").send(formattedBook);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const authorParam = req.params.author;
  const matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    const book = books[isbn];
    if (book.author === authorParam) {
      matchingBooks[isbn] = book;
    }
  });

  if (Object.keys(matchingBooks).length > 0) {
    const formattedBooks = JSON.stringify(matchingBooks, null, 2);
    res.status(200).type("json").send(formattedBooks);
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const titleParam = req.params.title;
  const matchingBooks = {};

  Object.keys(books).forEach((isbn) => {
    const book = books[isbn];
    if (book.title === titleParam) {
      matchingBooks[isbn] = book;
    }
  });

  if (Object.keys(matchingBooks).length > 0) {
    const formattedBooks = JSON.stringify(matchingBooks, null, 2);
    res.status(200).type("json").send(formattedBooks);
  } else {
    res.status(404).json({ message: "No books found by this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    const formattedReviews = JSON.stringify(book.reviews, null, 2);
    res.status(200).type("json").send(formattedReviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
