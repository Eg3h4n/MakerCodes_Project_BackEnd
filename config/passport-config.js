const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const SteamStrategy = require("passport-steam").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true
      //session: false
    },
    async (req, email, password, done) => {
      try {
        //Checking if email already in database
        const emailExists = await UserModel.findOne({ email: email });
        if (emailExists)
          return done(null, false, { message: "Email already exists!" });

        //Checking if username is taken
        const userNameExists = await UserModel.findOne({
          username: req.body.username
        });
        if (userNameExists)
          return done(null, false, { message: "Username is taken!" });

        //Hashing the password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        //Creation of the user with only required parts
        const user = new UserModel({
          username: req.body.username,
          email: email,
          password: hashedPassword
        });

        //Saving the user to db
        const savedUser = await user.save();
        return done(null, savedUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email"
      //passReqToCallback: true
      //session: false
    },
    async (email, password, done) => {
      try {
        //checking if email exists in database
        const user = await UserModel.findOne({ email: email });
        if (!user)
          return done(null, false, {
            message: "Email or password is incorrect"
          });
        //checking if the password is correct
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: "Email or password is incorrect"
          });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "jwt",
  new JwtStrategy(
    {
      //we verify the token via passport (without using jwt.verify)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        const user = await UserModel.findById(payload._id);

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "steam",
  new SteamStrategy(
    {
      returnURL: "http://localhost:3000/auth/steam/return",
      realm: "http://localhost:3000/",
      apiKey: "0D26FC461BF1196D78EE2CC601A1E54D"
    },
    (identifier, profile, done) => {
      User.findByOpenID({ openId: identifier }, (err, user) => {
        return done(err, user);
      });
    }
  )
);

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

/* //This is our passport initialize function
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

module.exports = initialize; */

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
