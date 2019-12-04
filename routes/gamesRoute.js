const router = require("express").Router();
const GameModel = require("../models/game");

router.get("/", async (req, res) => {
  const games = await GameModel.find();

  res.send(games);
});

router.post("/", async (req, res) => {
  const game = new GameModel(req.body);
  const saved = await game.save();

  res.send(saved);
});

router.put("/:id", async (req, res) => {
  const game = await GameModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  const saved = await game.save();
  res.send(saved);
});

router.delete("/:id", async (req, res) => {
  const game = await GameModel.findByIdAndDelete(req.params.id);

  res.send(game);
});

module.exports = router;
