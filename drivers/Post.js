const Post = require("../models/Post");
const fs = require("fs");
const path = require("path");

const createPost = async (req, res) => {
  try {
    let params = req.body;
    let user = req.user;
    if (
      !params.postData.title ||
      !params.postData.description ||
      !params.postData.price ||
      !params.postData.city ||
      !params.postData.village
    ) {
      console.log("fields missing");
      return res.status(400).json({
        status: "error",
        message: "Please enter all required fields",
      });
    }
    let post = new Post({
      user: user.id,
      userData: params.userData,
      title: params.postData.title,
      description: params.postData.description,
      price: params.postData.price,
      size: params.postData.size,
      city: params.postData.city,
      village: params.postData.village,
      address: params.postData.address,
    });
    await post.save();
    return res.status(200).json({
      status: "success",
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      message: "Post creation failed",
      error,
    });
  }
};

const uploadImg = async (req, res) => {
  try {
    const files = req.files;
    console.log(files);

    if (files.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Files not found",
      });
    }

    let post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { files: files.map((file) => file.filename) },
      { new: true }
    );

    if (!post) {
      return res.status(400).json({
        status: "error",
        message: "Post not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "File uploaded",
      post,
      files: files.map((image) => ({
        originalname: image.originalname,
        filename: image.filename,
      })),
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      message: "Error",
      error,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    let params = req.params;
    if (!params.id) {
      return res.status(400).json({
        status: "error",
        message: "Missing params",
      });
    }
    let user = req.user;
    const post = await Post.findOneAndDelete({
      _id: params.id,
      user: user.id,
    });
    if (!post.length) {
      return res.status(400).json({
        status: "error",
        message: "Post not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Post deleted successfully",
      user: user.username,
      post,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Post deletion failed",
      error,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    let user = req.user;
    let params = req.params;
    if (params.id) {
      user.id = params.id;
    }

    const posts = await Post.find({ user: user.id }).sort("-createdAt");
    if (!posts.length) {
      console.log("posts not found");
      return res.status(400).json({
        status: "error",
        message: "Posts not found",
      });
    }
    let postsClean = [];
    posts.forEach((post) => {
      postsClean.push({
        _id: post._id,
        title: post.title,
        description: post.description,
        price: post.price,
        size: post.size,
        city: post.city,
        village: post.village,
        address: post.address,
        files: post.files,
        createdAt: post.createdAt,
      });
    });
    const totalPosts = await Post.countDocuments({ user: user.id });
    return res.status(200).json({
      status: "success",
      message: "Posts retrieved successfully",
      user,
      totalPosts,
      posts: postsClean,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      message: "Post fetch failed",
      error,
    });
  }
};

const getPost = async (req, res) => {
  try {
    let params = req.params;
    console.log(params);
    if (!params.id) {
      return res.status(400).json({
        status: "error",
        message: "Missing params",
      });
    }
    const post = await Post.findById(params.id);
    if (!post) {
      return res.status(400).json({
        status: "error",
        message: "Post not found",
      });
    }
    console.log(post);
    return res.status(200).json({
      status: "success",
      message: "Post retrieved successfully",
      post,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Post fetch failed",
      error,
    });
  }
};

const getImg = async (req, res) => {
  try {
    const file = req.params.file;
    const pathFile = `./uploads/posts/${file}`;
    fs.stat(pathFile, (error, exists) => {
      if (!exists) {
        return res.status(400).json({
          status: "error",
          message: "File not found",
          error,
        });
      }
      return res.sendFile(path.resolve(pathFile));
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      message: "Error",
      error,
    });
  }
};

const feed = async (req, res) => {
  try {
    const posts = await Post.find().sort("-createdAt").populate("userData");
    if (!posts.length) {
      return res.status(400).json({
        status: "error",
        message: "Posts not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Posts retrieved successfully",
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      message: "Post fetch failed",
      error,
    });
  }
};

module.exports = {
  createPost,
  uploadImg,
  deletePost,
  getPosts,
  getPost,
  getImg,
  feed,
};
