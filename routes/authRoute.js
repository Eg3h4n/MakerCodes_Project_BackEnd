const router = require("express").Router();
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcrypt");
const _ = require("lodash");

router.post("/register", async (req, res) => {
  //Validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if email already in database
  const emailExists = await UserModel.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists!");

  //Checking if username is taken
  const userNameExists = await UserModel.findOne({
    username: req.body.username
  });
  if (userNameExists) return res.status(400).send("Username is taken!");

  //Hashing the password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Creation
  const user = new UserModel({
    username: req.body.username,
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: hashedPassword
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  //Validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Checking if email exists in database
  const user = await UserModel.findOne({ email: req.body.email });
  if (user) {
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid)
      return res.status(400).send("Invalid email or password!");

    //if email and password are valid we create a jwt token
    const token = jwt.sign(_.pick(user, ["_id"]), process.env.JWT_SECRET);
    return res.header("Auth-Token", token).send(`Welcome back ${user.email}`);
  } else {
    return res.status(400).send("Invalid email or password!");
  }
});

module.exports = router;
