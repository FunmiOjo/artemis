const router = require("express").Router();
const {getGenreEpisodes} = require("../listennotes");

router.get("/one", async (req, res, next) => {
  try {
    const id = req.query.id;
    const selectedPodcasts = await getGenreEpisodes(id, 1);
    res.status(200).send(selectedPodcasts);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const id = req.query.id;
    const selectedPodcasts = await getGenreEpisodes(id, 5);
    res.status(200).send(selectedPodcasts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
