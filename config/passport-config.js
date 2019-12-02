const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");

/* passport.use(
  new LocalStrategy(async function(email, password, done) {
    const user = await UserModel.findOne({ email: email });
    if (!user)
      return done(null, false, { message: "Email or password is incorrect" });

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Email or password is incorrect" });
      }
    } catch (err) {
      return done(err);
    }
  })
); */

/* passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  UserModel.findById(id, function(err, user) {
    done(err, user);
  });
}); */

//This is our passport initialize function
function initialize(passport) {
  //This is the function used to authenticate a user
  const authenticateUser = async (email, password, done) => {
    //checking if email exists in database
    const user = await UserModel.findOne({ email: email });
    if (!user)
      return done(null, false, { message: "Email or password is incorrect" });

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Email or password is incorrect" });
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    UserModel.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
      },
      (payload, done) => {
        const user = done(null, user);
      }
    )
  );
}

module.exports = initialize;

/* const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const UserModel = require("../models/user");

const jwtStrat = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  (payload, next) => {
    const user = next(null, user);
  }
);

passport.use(jwtStrat); */
