const bcrypt = require("bcrypt");
const saltRounds = bcrypt.genSaltSync(10);
const mongoose = require("mongoose");
const USER = require("../models/Users").USER;
const jwt = require("jsonwebtoken");
async function registerUser(req, res) {
  try {
    let password = undefined;
    bcrypt.hash(req.body.password, 10).then((hash) => {
      password = hash;
    });
    const newUser = new USER({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, saltRounds),
    });
    await newUser
      .save()
      .then(() => {
        console.log(`User with following credintials been added ${newUser}`);
      })
      .then(() => {
        jwt.sign(
          { id: newUser._id, username: newUser.username },
          process.env.SECRET_KEY_JWT,
          {},
          (err, token) => {
            if (err) throw err;
            res
              .cookie("signToken", token, { sameSite: "none", secure: true })
              .json({
                id: newUser._id,
                username: newUser.username,
              })
              .status(201);
          }
        );
      });
  } catch (err) {
    console.log(err);
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  const foundUser = await USER.findOne({ username });
  if (foundUser != null || undefined || {} || []) {
    let authentication = bcrypt.compareSync(password, foundUser.password);
    if (authentication == true) {
      jwt.sign(
        { id: foundUser._id, username: foundUser.username },
        process.env.SECRET_KEY_JWT,
        {},
        (err, token) => {
          if (err) throw err;
          res
            .cookie("signToken", token, { sameSite: "none", secure: true })
            .json({
              id: foundUser._id,
              username: foundUser.username,
            })
            .status(200);
        }
      );
    } else {
      res
        .status(403)
        .json("The password provided is not correct pz try agian later");
    }
  }
}

module.exports = { registerUser, login };
