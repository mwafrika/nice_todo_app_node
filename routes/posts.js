// routes/posts.js
const express = require("express");
const router = express.Router();
const {
  createPost,
  getPostsByUser,
  updatePost,
  deletePost,
  getPost,
} = require("../controllers/post");

// Create a new post
router.post("/", createPost);

// Get all posts by the authenticated user
router.get("/", getPostsByUser);

// Get a post by ID
router.get("/:postId", getPost);

// Update a post by the authenticated user
router.put("/", updatePost);

// Delete a post by the authenticated user
router.delete("/", deletePost);

module.exports = router;
