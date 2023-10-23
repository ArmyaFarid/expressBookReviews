const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { "username": "Farid", "password": "test1234" },
  { "username": "Alice", "password": "password123" },
  { "username": "Bob", "password": "securePW" }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return true;
}

const jwtSecretKey = 'your-jwt-secret-key';


//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Find the user by username
  const user = users.find((user) => user.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Authentication failed. Invalid username or password.' });
  }

  // User is authenticated; create a JWT
  const token = jwt.sign({ username: user.username }, jwtSecretKey);

  // Store user info and token in the session
  req.session.user = user;
  req.session.token = token;

  res.status(200).json({ message: 'Login successful', token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const reviewText = req.query.review;

  // Check if the user is logged in
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required to post a review.' });
  }

  const username = req.user;

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  // Check if the user has already posted a review for the book
  if (books[isbn].reviews[username]) {
    // Modify the existing review
    books[isbn].reviews[username] = reviewText;
    return res.status(200).json({ message: 'Review modified successfully.' });
  } else {
    // Add a new review
    books[isbn].reviews[username] = reviewText;
    return res.status(200).json({ message: 'Review added successfully.' });
  }
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user;

  // Check if the book with the given ISBN exists
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  // Check if the user has posted a review for the book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: 'Review not found for this user and book.' });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: 'Review deleted successfully.' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
