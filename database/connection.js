const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Roomfinder");
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    throw new Error("Error connecting to database");
  }
};

module.exports = {
  connection,
};
