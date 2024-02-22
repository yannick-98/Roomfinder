const Chat = require("../models/Chat");
const User = require("../models/User");

const createChat = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    let userD = req.body.userData;
    if (user._id == userD.id) {
      return res.status(400).json({
        status: "error",
        message: "You can't chat with yourself",
      });
    }
    let post = req.body.post;
    const chat = await Chat.findOne({
      $and: [
        { "users.user": user.id },
        { "users.user": userD.id },
        { "post.id": post.id },
      ],
    });
    if (chat) {
      return res.status(400).json({
        status: "error",
        message: "Chat already exists",
      });
    }
    const newChat = new Chat({
      users: [
        {
          user: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
        },
        {
          user: userD.id,
          username: userD.username,
          email: userD.email,
          phone: userD.phone,
        },
      ],
      post: req.body.post,
      messages: [],
    });
    await newChat.save();
    return res.status(200).json({
      status: "success",
      message: "Chat created successfully",
      chat: newChat,
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

const getChats = async (req, res) => {
  try {
    let user = req.user;
    const chats = await Chat.find({
      "users.user": user.id,
    });
    if (!chats.length) {
      return res.status(400).json({
        status: "error",
        message: "Chats not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Chats found successfully",
      chats,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Error",
      error,
    });
  }
};

const getChat = async (req, res) => {
  try {
    let params = req.params;
    let user = req.user;
    if (!params.id) {
      return res.status(400).json({
        status: "error",
        message: "Missing params",
      });
    }
    const chat = await Chat.findOne({
      _id: params.id,
      $or: [{ user1: user.id }, { user2: user.id }],
    });
    if (!chat) {
      return res.status(400).json({
        status: "error",
        message: "Chat not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Chat found successfully",
      chat,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Error",
      error,
    });
  }
};

const deleteChat = async (req, res) => {
  try {
    let params = req.params;
    let user = req.user;
    if (!params.id) {
      return res.status(400).json({
        status: "error",
        message: "Missing params",
      });
    }
    const chat = await Chat.findOneAndDelete({
      _id: params.id,
    });
    if (!chat) {
      return res.status(400).json({
        status: "error",
        message: "Chat not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Chat deleted successfully",
      chat,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Error",
      error,
    });
  }
};

const addMessage = async (req, res) => {
  try {
    let params = req.params;
    let body = req.body;
    let user = req.user;
    if (!params.id || !body.message) {
      return res.status(400).json({
        status: "error",
        message: "Missing params",
      });
    }
    const chat = await Chat.findOne({
      _id: params.id,
      $or: [{ user1: user.id }, { user2: user.id }],
    });
    if (!chat) {
      return res.status(400).json({
        status: "error",
        message: "Chat not found",
      });
    }
    chat.messages.push({
      user: user.id,
      message: body.message,
    });
    await chat.save();
    return res.status(200).json({
      status: "success",
      message: "Message added successfully",
      chat,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Error",
      error,
    });
  }
};

module.exports = {
  createChat,
  getChats,
  getChat,
  deleteChat,
  addMessage,
};
