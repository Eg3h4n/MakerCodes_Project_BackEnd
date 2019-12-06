const router = require("express").Router();
//const verifyToken = require("../middleware/verifyToken");
// const UserModel = require("../models/user");
const passport = require("passport");
//const lodash = require("lodash");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

module.exports = router;
