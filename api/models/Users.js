const mongoose = require("mongoose");

const newUserSchema = new mongoose.Schema(
  {
    username: {type:String,unique:true},
    password: String,
  },
  { timestamps: true }
);
const USER = mongoose.model("USER", newUserSchema);
module.exports = { USER };
