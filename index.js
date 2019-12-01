const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("config");

const server = express();

//MongoDB
console.log(config.get("name"));
mongoose
  .connect(config.get("mongodb.host"), {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.log("MongoDB error: ", err.message));

//Middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

//Routes
const authRoute = require("./routes/authRoute");

server.use("/auth", authRoute);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Server is listening on PORT ${PORT}...`)
);
