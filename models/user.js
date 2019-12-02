const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: false
  },
  surname: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: "game" }]
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
