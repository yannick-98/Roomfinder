const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: "String",
  },
  password: {
    type: "String",
    required: true,
  },
  avatar: {
    type: String,
    default: "https://www.w3schools.com/howto/img_avatar.png",
  },
  favorites: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("User", UserSchema, "users");
