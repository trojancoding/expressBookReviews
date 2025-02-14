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

// Get the book list available in the shop using Promises
public_users.get("/", function (req, res) {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 0);
  })
    .then((booksData) => {
      const formattedBooks = JSON.stringify(booksData, null, 2);
      res.status(200).type("json").send(formattedBooks);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching books" });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    }, 0);
  })
    .then((book) => {
      const formattedBook = JSON.stringify(book, null, 2);
      res.status(200).type("json").send(formattedBook);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const authorParam = req.params.author;

  new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchingBooks = {};
      Object.keys(books).forEach((isbn) => {
        const book = books[isbn];
        if (book.author === authorParam) {
          matchingBooks[isbn] = book;
        }
      });

      if (Object.keys(matchingBooks).length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found by this author");
      }
    }, 0);
  })
    .then((matchingBooks) => {
      const formattedBooks = JSON.stringify(matchingBooks, null, 2);
      res.status(200).type("json").send(formattedBooks);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

// Get book details based on title using Promises
public_users.get("/title/:title", function (req, res) {
  const titleParam = req.params.title;

  new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchingBooks = {};
      Object.keys(books).forEach((isbn) => {
        const book = books[isbn];
        if (book.title === titleParam) {
          matchingBooks[isbn] = book;
        }
      });

      if (Object.keys(matchingBooks).length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found by this title");
      }
    }, 0);
  })
    .then((matchingBooks) => {
      const formattedBooks = JSON.stringify(matchingBooks, null, 2);
      res.status(200).type("json").send(formattedBooks);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
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
