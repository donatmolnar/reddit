'use strict';

const express = require('express');
const app = express();
const mysql = require('mysql');
require('dotenv').config();

app.use(express.json());
app.use(express.static('public'));

const host = process.env.HOST;
const user = process.env.USER;
const pass = process.env.PASS;
const db = process.env.DB;
const auth = process.env.AUTH || true;

const conn = mysql.createConnection({
  host: host,
  user: user,
  password: pass,
  database: db,
  insecureAuth: auth,
});

// connects to mysq
conn.connect((err) => {
  if (err) throw err;
  console.log('Connected to mysql');
});

// sends the landingpage
app.get('/', (req,res) => {
  res.status(200).sendFile('index.html');
});

// sends the add post page
app.get('/add', (req,res) => {
  res.status(200).sendFile(__dirname + '/public/add.html');
});

// sends the modify post page
app.get('/modify', (req,res) => {
  res.status(200).sendFile(__dirname + '/public/modify.html');
});

// sends all the active posts
app.get('/posts', (req,res) => {
  conn.query(
    `SELECT * FROM posts WHERE is_active = true ORDER BY post_id DESC;`, (err, rows) => {
      if (err) {
        console.log(err.toString());
        res.status(500).json({error: 'error during reading sql db'})
        return;
      }
      res.setHeader('Content-type', 'application/json');
      res.status(200).json(rows);
    });
});

// sends a single post based on id
app.get(`/posts/:id`, (req,res) => {
  let id = req.params.id;
  conn.query(
    `SELECT * FROM posts WHERE is_active = true AND post_id = ?;`, [id], (err, rows) => {
      if (err) {
        console.log(err.toString());
        res.status(500).json({error: 'error during reading sql db'})
        return;
      }
      res.status(200).json(rows);
    });
  });

// adds new post
app.post('/newpost', (req,res) => {
  let title = req.body.title;
  let url = req.body.url;
  let owner = req.body.owner;

  conn.query(
    `INSERT INTO posts (title, url, owner) VALUES (?,?,?);`, [title, url, owner], (err, rows) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
    });

  conn.query(
    `SELECT * FROM posts WHERE is_active = true AND post_id = (SELECT MAX(post_id) FROM posts);`, (err, rows) => {
      if (err) {
        console.log(err.toString());
        res.status(500).json({error: 'error during reading sql db'})
        return;
      }
      //res.status(200).json(rows);
    });
      //res.redirect('/');
});

// upvote
app.put('/posts/:id/upvote', (req,res) => {
  let id = req.params.id;
  conn.query(
    `UPDATE posts SET score = score + 1 WHERE post_id = ?;`, [id], (err, rows) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      //res.status(200).json(rows);
    });

  conn.query(
    `SELECT * FROM posts WHERE is_active = true AND post_id = ?;`, [id], (err, rows) => {
      if (err) {
        console.log(err.toString());
        res.status(500).json({error: 'error during reading sql db'})
        return;
      }
      res.status(200).json(rows);
    });
});

// downvote
app.put('/posts/:id/downvote', (req,res) => {
  let id = req.params.id;
  conn.query(
    `UPDATE posts SET score = score - 1 WHERE post_id = ?;`, [id], (err, rows) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      //res.status(200).json(rows);
    });

  conn.query(
    `SELECT * FROM posts WHERE is_active = true AND post_id = ?;`, [id], (err, rows) => {
      if (err) {
        console.log(err.toString());
        res.status(500).json({error: 'error during reading sql db'})
        return;
      }
      res.status(200).json(rows);
    });
});

// delete
app.delete('/posts/:id', (req,res) => {
  let id = req.params.id;
  conn.query(
    `UPDATE posts SET is_active = false WHERE post_id = ?;`, [id], (err, rows) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.status(200).json(rows);
    });
});

// retieve deleted posts
app.delete('/posts/:id/recycle', (req,res) => {
  let id = req.params.id;
  conn.query(
    `UPDATE posts SET is_active = true WHERE post_id = ?;`, [id], (err, rows) => { // owner = null is deleting?
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.status(200).json(rows);
    });
});

// update post
app.put('/posts/:id', (req,res) => {
  let id = req.params.id;
  let title = req.body.title;
  let url = req.body.url;

  conn.query(
    `UPDATE posts SET (title, url) VALUE (?,?) WHERE post_id = ? AND is_active = true;`, [title, url, id], (err, rows) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.status(200).json(rows);
    });
});

// permanent delete
app.delete('/posts/purge/:id', (req,res) => {
  let id = req.params.id;
  conn.query(
    `DELETE FROM posts WHERE post_id = ?;`, [id], (err, rows) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.status(200).json(rows);
    });
});

app.listen(process.env.PORT || 3000);

module.exports = app;