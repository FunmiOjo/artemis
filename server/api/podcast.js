const router = require("express").Router();
const unirest = require("unirest");
const {getBestPodcastsInGenre} = require("../listennotes");

router.get("/", async (req, res, next) => {
  try {
    const id = req.query.id;
    const bestPodcastsInGenre = await getBestPodcastsInGenre(id);
    console.log(
      "best podcasts ----------------------------------------- ",
      bestPodcastsInGenre
    );
    // unirest
    //   .get(
    //     `https://listennotes.p.mashape.com/api/v1/best_podcasts?genre_id=${id}&page=1`
    //   )
    //   .header("X-Mashape-Key", process.env.xMashKey)
    //   .header("Accept", "application/json")
    //   .end(function(result) {
    res.status(200).send(bestPodcastsInGenre);
    //  });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
