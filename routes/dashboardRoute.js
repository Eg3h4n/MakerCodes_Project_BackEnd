const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
// const UserModel = require("../models/user");

router.get("/", (req, res) => {
  res.send("This is my dashboard");
});

module.exports = router;
