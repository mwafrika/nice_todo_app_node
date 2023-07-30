// controllers/auth.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Post = require("../models/post");

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Get the user ID from the authenticated token
    const userId = req.user.userId;

    // Create a new post
    const post = new Post({
      title,
      content,
      author: userId,
    });

    // Save the post to the database
    await post.save();

    // Update the user's posts array
    const user = await User.findById(userId);

    if (!user || !user.posts) {
      return res
        .status(404)
        .json({ error: "User not found or posts array missing" });
    }

    user.posts.push(post._id);
    await user.save();

    res.json({ message: "Post created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all posts by the authenticated user
exports.getPostsByUser = async (req, res) => {
  try {
    // Get the user ID from the authenticated token
    const userId = req.user.userId;

    // Find all posts by the user
    const posts = await Post.find({ author: userId });

    res.json(posts);
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a post by the authenticated user
exports.updatePost = async (req, res) => {
  try {
    const { postId, title, content } = req.body;

    // Get the user ID from the authenticated token
    const userId = req.user.userId;

    // Check if the post exists and is authored by the user
    const post = await Post.findOne({ _id: postId, author: userId });
    if (!post) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    // Update the post
    post.title = title;
    post.content = content;
    await post.save();

    res.json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a post by the authenticated user
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.body;

    // Get the user ID from the authenticated token
    const userId = req.user.userId;

    // Check if the post exists and is authored by the user
    const post = await Post.findOne({ _id: postId, author: userId });
    if (!post) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    // Delete the post
    await post.deleteOne();

    // Remove the post ID from the user's posts array
    const user = await User.findById(userId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// get a single post
exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Get the user ID from the authenticated token
    const userId = req.user.userId;

    // Check if the post exists and is authored by the user
    const post = await Post.findOne({ _id: postId, author: userId });
    if (!post) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error getting post:", error);
    res.status(500).json({ error: "Server error" });
  }
};
