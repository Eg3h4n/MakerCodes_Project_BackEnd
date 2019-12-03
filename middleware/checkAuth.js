const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
  const authHeader = req.header("Authorization");
  //checking if the req already has a valid token, if so won't be able to continue
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (verified) {
      return res.redirect("/dashboard");
    } else {
      next();
    }

    /* //or
    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
      if (err) return next();

      return res.redirect("/dashboard");
    }); */
  }
  next();
  /*  const token = req.header("Auth-Token");

  if (!token) return res.status(401).send("Access Denied!");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).send("Invalid Token");
  } */
}

module.exports = checkAuth;
