const express = require("express");
const router = express.Router();
const check = require("../middlewares/auth");
const Chat = require("../drivers/Chat");

router.post("/createChat", check.auth, Chat.createChat);
router.get("/getChats", check.auth, Chat.getChats);
router.get("/getChat/:id", check.auth, Chat.getChat);
router.delete("/deleteChat/:id", check.auth, Chat.deleteChat);
router.put("/addMessage/:id", check.auth, Chat.addMessage);

module.exports = router;
