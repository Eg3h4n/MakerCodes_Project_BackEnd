const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

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
    req.url = "http://localhost:3000";
    next();
  },
  passport.authenticate("steam", { failureRedirect: "/" }),
  async (req, res) => {
    const user = req.user;

    console.log(user);

    res.json(user);
  }
);

module.exports = router;
