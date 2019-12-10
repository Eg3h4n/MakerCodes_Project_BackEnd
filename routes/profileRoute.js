const router = require("express").Router();
const UserModel = require("../models/user");
const _ = require("lodash");
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const users = await UserModel.find();

    res.send(users);
  }
);

router.get(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await UserModel.findOne({
      username: req.params.username
    }).populate("games");

    if (!user) return res.status(404).send("User not found!");

    _.reverse(user.games);

    res.json(
      _.pick(user, [
        "username",
        "name",
        "surname",
        "email",
        "games",
        "avatarURL",
        "memberSince"
      ])
    );
  }
);

module.exports = router;
