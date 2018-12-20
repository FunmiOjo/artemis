const axios = require("axios");

const getBestPodcastsInGenre = async genreId => {
  try {
    const {data: podcastsWithoutEpisodes} = await axios({
      method: "get",
      url: `https://listennotes.p.mashape.com/api/v1/best_podcasts?genre_id=${genreId}&page=1`,
      headers: {
        "X-Mashape-Key": process.env.xMashKey,
        Accept: "application/json"
      }
    });
    return podcastsWithoutEpisodes;
  } catch (error) {
    return error;
  }
};

module.exports = {getBestPodcastsInGenre};
