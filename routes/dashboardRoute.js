const router = require("express").Router();
//const verifyToken = require("../middleware/verifyToken");
const UserModel = require("../models/user");
const passport = require("passport");
const _ = require("lodash");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await UserModel.findById(req.user._id).populate("games");

    //_.reverse(user.games);

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

router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(req.user._id, req.body, {
      new: true
    });

    const saved = await user.save();

    res.json(
      _.pick(saved, [
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
