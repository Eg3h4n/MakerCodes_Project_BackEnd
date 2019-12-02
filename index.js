const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const server = express();
dotenv.config();
mongoose.set("useCreateIndex", true);

//MongoDB
console.log(process.env.DB_NAME);
mongoose
  .connect(process.env.DB_HOST, {
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

const PORT = process.env.PORT;
server.listen(PORT, () =>
  console.log(`Server is listening on PORT ${PORT}...`)
);
