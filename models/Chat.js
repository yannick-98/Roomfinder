const { Schema, model } = require("mongoose");

const ChatSchema = new Schema({
  users: {
    type: Array,
    required: true,
  },
  post: {
    type: Object,
    required: true,
  },
  messages: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Chat", ChatSchema, "chats");
