const axios = require("axios");
const {getSelectedItems, restructurePodcastObj} = require("../utils");
//TODO

const getRecentEpisodesFromPodcast = async podcastId => {
  try {
    const {data} = await axios({
      method: "get",
      url: `https://api.listennotes.com/api/v1/podcasts/${podcastId}/?sort=recent_first`,
      headers: {
        "X-Mashape-Key": process.env.xMashKey,
        Accept: "application/json"
      }
    });

    return data;
  } catch (error) {
    return error;
  }
};

const getRecentEpisodesFromPodcasts = async podcastList => {
  try {
    const podcastEpisodesPromises = podcastList.map(podcast =>
      getRecentEpisodesFromPodcast(podcast.id)
    );
    const podcastEpisodes = await Promise.all(podcastEpisodesPromises);
    return podcastEpisodes;
  } catch (error) {
    return error;
  }
};

const getBestPodcastsInGenre = async genreId => {
  try {
    const {data} = await axios({
      method: "get",
      url: `https://api.listennotes.com/api/v1/best_podcasts?genre_id=${genreId}&page=1`,
      headers: {
        "X-Mashape-Key": process.env.xMashKey,
        Accept: "application/json"
      }
    });
    const podcastsWithoutEpisodes = data.channels;
    return podcastsWithoutEpisodes;
  } catch (error) {
    return error;
  }
};

/*
Because of Listen Notes API setup, we must first get the best podcasts in a genre, then make
another request for the episodes attached to them.  In between, we select one episode each from
five of the best podcasts
*/
const getGenreEpisodes = async (genreId, desiredNumEpisodes) => {
  try {
    const podcastsWithoutEpisodes = await getBestPodcastsInGenre(genreId);

    const desiredNumPodcasts =
      podcastsWithoutEpisodes.length < desiredNumEpisodes
        ? podcastsWithoutEpisodes.length
        : desiredNumEpisodes;

    const numPodcastsToSelectFrom = podcastsWithoutEpisodes.length;

    const selectedPodcasts = getSelectedItems({
      items: podcastsWithoutEpisodes,
      desiredNumItems: desiredNumPodcasts,
      numItemsToSelectFrom: numPodcastsToSelectFrom
    });

    const selectedPodcastsWithEpisodes = await getRecentEpisodesFromPodcasts(
      selectedPodcasts
    );

    const selectedPodcastsWithSelectedEpisodes = selectedPodcastsWithEpisodes.map(
      podcast => {
        podcast.episodes = getSelectedItems({
          items: podcast.episodes,
          desiredNumItems: 1,
          numItemsToSelectFrom: podcast.episodes.length
        });
        return restructurePodcastObj(podcast);
      }
    );
    return selectedPodcastsWithSelectedEpisodes;
  } catch (error) {
    return error;
  }
};

module.exports = {getGenreEpisodes};
