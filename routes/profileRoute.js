const router = require("express").Router();
const UserModel = require("../models/user");
const _ = require("lodash");
const passport = require("passport");

router.get(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await UserModel.findOne({ username: req.params.username });

    if (!user) return res.status(404).send("User not found!");

    res.json(_.pick(user, ["username", "name", "surname", "email", "games"]));
  }
);

module.exports = router;
