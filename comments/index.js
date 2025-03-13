const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");

const port = 3003;

app.use(bodyParser.json()); // Middleware đọc JSON
app.use(express.json()); // Thêm middleware JSON nếu cần
app.use(cors());
const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });

  commentsByPostId[req.params.id] = comments;

  res.status(201).json(comments);
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
