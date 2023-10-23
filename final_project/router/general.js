const express = require('express');
const books = require('./booksdb.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks=()=>{
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books)
    },6000)
  })
}

const getBooksByISBN=(isbn)=>{
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try{
        let book = books[isbn];
        resolve(book);
      }catch(e){
        reject("No valid isbn");
      }
    },2000)
  })
}

const getBooksByKey=(keys)=>{
  const { title, author } = keys;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try{
        const filteredBooks = [];
        for (const bookId in books) {
          if(title && author){
            if (books[bookId].author === author && books[bookId].title === title) {
              filteredBooks.push(books[bookId]);
            }
          }else{
            if (books[bookId].author === author || books[bookId].title === title) {
              filteredBooks.push(books[bookId]);
            }
          }
        }
        resolve(filteredBooks);
      }catch(e){
        reject("Error");
      }
    },2000)
  })
}

public_users.post("/register", (req,res) => {
  //Write your code here
  
  console.log(users)
  
  if(!req.body.password || !req.body.username){
    return res.status(404).json({message: "All credenntial not provided"});
  }
  if(users.some(user => user.username === req.body.username)){
    return res.status(401).json({message: "User already exist"});
  }
  users.push(req.body);
  return res.status(200).json({});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  console.log(books);
  const jsonBooks = JSON.stringify(books);
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  console.log(req.params.isbn);
  return res.status(300).json(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorBooks = [];
  
  for (const bookId in books) {
    if (books[bookId].author === req.params.author) {
      authorBooks.push(books[bookId]);
    }
  }
  return res.status(300).json(authorBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleBooks = [];
  
  for (const bookId in books) {
    if (books[bookId].title === req.params.title) {
      titleBooks.push(books[bookId]);
    }
  }
  return res.status(300).json(titleBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
