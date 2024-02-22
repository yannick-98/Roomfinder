const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

connection();
console.log("project started");

const app = express();
const port = 3100;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserRoutes = require("./Routes/User");
const PostRoutes = require("./Routes/Post");
const ChatRoutes = require("./Routes/Chat");

app.use("/api/user", UserRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/chat", ChatRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
