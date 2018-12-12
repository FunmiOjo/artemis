const router = require("express").Router();
const unirest = require("unirest");
const {Genre} = require("../db/models");

router.get("/", async (req, res, next) => {
  try {
    if (req.query) {
      const genres = await Genre.findAll({
        where: req.query
      });
      res.status(200).send(genres);
    } else {
      const genres = await Genre.findAll({});
      res.status(200).send(genres);
    }
  } catch (err) {
    next(err);
  }
});

router.get("/apilist", async (req, res, next) => {
  try {
    unirest
      .get("https://listennotes.p.mashape.com/api/v1/genres")
      .header("X-Mashape-Key", process.env.xMashKey)
      .header("Accept", "application/json")
      .end(function(result) {
        res.status(200).send(result.body);
      });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
