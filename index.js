if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
require("./config/passport-config");
//const session = require("express-session");

const server = express();

//MongoDB
console.log(process.env.DB_NAME);
mongoose
  .connect(process.env.DB_HOST, {
    //To remove the deprecation warning of mongoose
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.log("MongoDB error: ", err.message));

//Middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());
/* server.use(
  session({
    secret: process.env.SESSION_SECRET,
    //to disable saving over unchanged session
    resave: false,
    //to disable saving empty sessions
    saveUninitialized: false
  })
); */
server.use(passport.initialize());
//server.use(passport.session());
//initializePassport(passport);

//Routes
const authRoute = require("./routes/authRoute");
const profileRoute = require("./routes/profileRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const gamesRoute = require("./routes/gamesRoute");
const steamAuthRoute = require("./routes/steamAuthRoute");

server.use("/auth", authRoute);
server.use("/profile", profileRoute);
server.use("/dashboard", dashboardRoute);
server.use("/games", gamesRoute);
server.use("/steamAuth", steamAuthRoute);

const PORT = process.env.PORT;
server.listen(PORT, () =>
  console.log(`Server is listening on PORT ${PORT}...`)
);
