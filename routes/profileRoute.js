const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const UserModel = require("../models/user");
const _ = require("lodash");

router.get("/:username", async (req, res) => {
  const user = await UserModel.findOne({ username: req.params.username });

  if (!user) return res.status(404).send("User not found!");

  res.send(_.pick(user, ["username", "name", "surname", "email"]));
});

module.exports = router;
