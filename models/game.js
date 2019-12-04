const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  publisher: {
    type: String,
    required: true
  },
  releaseYear: {
    type: Number,
    required: true
  },
  genres: [
    {
      type: String
    }
  ]
});

const GameModel = mongoose.model("game", GameSchema);

module.exports = GameModel;
