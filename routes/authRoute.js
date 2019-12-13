const router = require("express").Router();
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const { registerValidation, loginValidation } = require("../validation");
//const bcrypt = require("bcrypt");
const _ = require("lodash");
const checkAuth = require("../middleware/checkAuth");
const validator = require("express-joi-validation").createValidator({});
const passport = require("passport");

router.post(
  "/register",
  [
    checkAuth,
    validator.body(registerValidation),
    passport.authenticate("register", { session: false })
  ],
  async (req, res) => {
    //Adding the optional parts to the user here
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        surname: req.body.surname
      },
      {
        new: true
      }
    );

    await user.save();
    //signing this user's token here
    const token = jwt.sign(_.pick(user, ["_id"]), process.env.JWT_SECRET);
    return res.json({ success: true, token: "Bearer " + token, user: user });
  }
);

router.post(
  "/login",
  [
    checkAuth,
    validator.body(loginValidation),
    passport.authenticate("login", { session: false })
  ],
  async (req, res) => {
    const token = await jwt.sign(
      _.pick(req.user, ["_id"]),
      process.env.JWT_SECRET
    );

    console.log(`welcome ${req.user.username}`);
    return res.json({
      success: true,
      token: "Bearer " + token,
      user: req.user
    });
  }
);

//This will redirect user to steam login page
router.get(
  "/steam",
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => {}
);
//user will return here after steam authentication is complete
router.get(
  "/dashboard",
  (req, res, next) => {
    req.url = "http://localhost:3000/dashboard";
    next();
  },
  passport.authenticate("steam", { failureRedirect: "/login" }),
  async (req, res) => {
    const user = req.user;

    console.log(user);

    res.json(user);
  }
);

// router.post(
//   "/register",
//   validator.body(registerValidation),
//   async (req, res) => {
/* //Validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message); */

/*     //Checking if email already in database
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
  }
); */

//router.post("/login", validator.body(loginValidation), async (req, res) => {
/* //Validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message); */

/* //Checking if email exists in database
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
}); */

/* router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
}); */

module.exports = router;
