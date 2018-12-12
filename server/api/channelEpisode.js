const router = require("express").Router();

const {ChannelEpisode} = require("../db/models");

module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    if (req.query) {
      const channelEpisodes = await ChannelEpisode.findAll({
        where: req.query
      });
      res.status(200).send(channelEpisodes);
    } else {
      const channelEpisodes = await ChannelEpisode.findAll({});
      res.status(200).send(channelEpisodes);
    }
  } catch (err) {
    next(err);
  }
});
