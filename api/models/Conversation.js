const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    textMessage: String,
    to: String,
    reciever: String,
    from: String,
    sender: String,
    timeStamp: String,
    imageUrl: Object,
    messageId: String,
    seen: Boolean,
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", messageSchema);

module.exports = Conversation;
