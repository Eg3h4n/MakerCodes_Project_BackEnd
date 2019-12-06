const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
  //console.log(req.get("Authorization"));
  const authHeader = req.header("Authorization");
  //checking if the req already has a valid token, if so, won't be able to continue
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    //if the user has an invalid or no token at all, will be able to continue
    jwt.verify(token, process.env.JWT_SECRET, err => {
      if (err) {
        return next();
      } else {
        return res.send("You are already logged in");
      }
    });
  } else {
    next();
  }
}

module.exports = checkAuth;
