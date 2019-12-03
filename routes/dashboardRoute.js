const router = require("express").Router();
//const verifyToken = require("../middleware/verifyToken");
// const UserModel = require("../models/user");
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(`This is ${req.user.username}'s dashboard`);
  }
);

module.exports = router;
