const router = require("express").Router();
const unirest = require("unirest");
const {getBestPodcastsInGenre, getGenreEpisodes} = require("../listennotes");

router.get("/", async (req, res, next) => {
  try {
    const id = req.query.id;
    const selectedPodcasts = await getGenreEpisodes(id);
    res.status(200).send(selectedPodcasts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
