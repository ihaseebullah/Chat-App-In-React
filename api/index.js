const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");
const bcrypt = require("bcrypt");
const bcryptSalt = bcrypt.genSaltSync(10);
const cloudinary = require("cloudinary");
const ws = require("ws");
env.config();
mongoose.connect(process.env.DB_GLOBAL).then(() => {
  console.log("Established a secure connection with the database");
});
const app = express();
app.use(express.json());
app.use(cookies());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
//Controllers
const userController = require("./controllers/UserControllers");
const Conversation = require("./models/Conversation");
const USER = require("./models/Users").USER;

//Middleware Configurations

cloudinary.config({
  cloud_name: "dkscouusb",
  api_key: "363549551425893",
  api_secret: "ZNsKnuY28UhpL8kd4k6HgLvTVX4",
});

app.post("/register", async (req, res) => {
  userController.registerUser(req, res);
});

app.get("/profile", async (req, res) => {
  const token = req.cookies?.signToken;
  const allUsers = await (await USER.find({}))
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY_JWT, {}, (err, userData) => {
      if (err) throw err;
      res.json({ ...userData, allUsers }).status(200);
    });
  } else {
    res.json("Unauthorized").status(401);
  }
});

app.post("/login", async function (req, res) {
  userController.login(req, res);
});

app.get("/chateoo/:userId", async function (req, res) {
  const prevConversation = await Conversation.find({
    $or: [{ to: req.params.userId }, { from: req.params.userId }],
  });
  const jsonFile = JSON.stringify(prevConversation);
  res.json(prevConversation).status(200);
});
app.get('/chateoo/markMessegesRead/:senderId/:id', async function (req, res) {
  const { id,senderId } = req.params;
  const prevConversation = (await Conversation.find({ $and: [{ to: id }, { from: senderId }] })).length

  for (let i = 0; i < prevConversation; i++) {
    let theMessage = {
      seen: true
    }
    await Conversation.updateMany({ $and: [{ to: id }, { from: senderId }] }, { $set: theMessage })
  }
})
const port = 3000;
const server = app.listen(port, () => {
  console.log(`Listineng on port ${port}`);
});
const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  const token = req.headers.cookie;
  if (token) {
    const signToken = token.split("signToken=")[1];
    jwt.verify(signToken, process.env.SECRET_KEY_JWT, {}, (err, userData) => {
      let { username, id } = userData;
      connection.username = username;
      connection.id = id;
      // console.log(userData)
    });
  } else {
    connection.send("login First boi");
  }
  connection.on("message", async (message) => {
    const newMessage = JSON.parse(message.toString());
    const { to, from, textMessage, reciever, sender, timeStamp, messageId } = newMessage;
    const newMessageForDb = new Conversation({
      messageId,
      textMessage,
      from: from,
      to: to,
      reciever,
      sender,
      timeStamp,
      seen: false
    });
    await newMessageForDb.save().then(() => {
      console.log("Message has been saved successfully");
      console.log(newMessageForDb);
    });
    [...wss.clients]
      .filter((client) => client.id === to)
      .forEach((filteredClient) => {
        filteredClient.send(
          JSON.stringify({
            messageId,
            textMessage,
            from: from,
            to: to,
            sender: sender,
            timeStamp,
            reciever,
          })
        );
      });
    console.log(newMessage);
  });

  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify(
        [...wss.clients].map((c) => ({ username: c.username, id: c.id }))
      )
    );
    console.log([...wss.clients].length);
  });
});
