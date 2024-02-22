const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "variables.env" });

connection();
console.log("project started");

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserRoutes = require("./Routes/User");
const PostRoutes = require("./Routes/Post");
const ChatRoutes = require("./Routes/Chat");

app.use("/user", UserRoutes);
app.use("/post", PostRoutes);
app.use("/chat", ChatRoutes);

app.listen(port, host, () => {
  console.log(`Server started on port ${port}`);
});
