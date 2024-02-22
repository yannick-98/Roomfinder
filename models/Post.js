const { Schema, model } = require("mongoose");

const PostSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  userData: {
    type: Object,
  },
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  size: {
    type: Number,
  },
  city: {
    type: String,
  },
  village: {
    type: String,
  },
  address: {
    type: String,
  },
  files: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Post", PostSchema, "posts");
