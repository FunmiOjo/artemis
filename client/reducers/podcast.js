import axios from "axios";
import {
  getRandomNonRepeatingIndices,
  convertPlayedEpisodesArrayToObject,
  getGenreIdFromGenreName
} from "../utilities";

import genres from "../genreList";
const SET_PODCAST = "SET_PODCAST";
const SET_PODCAST_LIST = "SET_PODCAST_LIST";
const SET_BEST_CATEGORY_PODCASTS = "SET_BEST_CATEGORY_PODCASTS";
const SET_REMOVED_BEST_CATEGORY_PODCAST = "SET_REMOVED_BEST_CATEGORY_PODCAST";
const SET_PLAYED_EPISODES = "SET_PLAYED_EPISODES";
const SET_ADDED_PLAYED_EPISODE = "SET_ADDED_PLAYED_EPISODE";
const SET_RECOMMENDED_EPISODES = "SET_RECOMMENDED_EPISODES";
const SET_EPISODE_LOADING_STATUS = "SET_EPISODE_LOADING_STATUS";

const initState = {
  podcast: {},
  podcastList: [],
  bestCategoryPodcasts: [],
  recommendedEpisodes: [],
  playedEpisodes: {}
};

export const setSinglePodcast = podcast => ({
  type: SET_PODCAST,
  singlePodcast: podcast
});

export const setBestCategoryPodcasts = podcasts => ({
  type: SET_BEST_CATEGORY_PODCASTS,
  podcasts
});

export const setRemovedBestCategoryPodcast = podcast => ({
  type: SET_REMOVED_BEST_CATEGORY_PODCAST,
  podcast
});

export const setPlayedEpisodes = episodes => ({
  type: SET_PLAYED_EPISODES,
  episodes
});

export const setAddedPlayedEpisode = episode => ({
  type: SET_ADDED_PLAYED_EPISODE,
  episode
});

export const setRecommendedEpisodes = episodes => ({
  type: SET_RECOMMENDED_EPISODES,
  episodes
});

export const setEpisodeLoadingStatus = status => {
  return {
    type: SET_EPISODE_LOADING_STATUS,
    status
  };
};

// THUNK CREATORS

export const fetchCategoryPodcasts = genreName => {
  const genreId = getGenreIdFromGenreName(genreName, genres);
  return async dispatch => {
    try {
      dispatch(setEpisodeLoadingStatus(true));
      const {data: episodes} = await axios.get(`/api/podcast?id=${genreId}`);
      dispatch(setBestCategoryPodcasts(episodes));
      dispatch(setEpisodeLoadingStatus(false));
    } catch (error) {
      console.error(error);
    }
  };
};

// export const fetchCategoryEpisodes = () => {
//   return async dispatch => {
//     dispatch(setEpisodeLoadingStatus(true));
//     let numEpisodesDesired =
//       podcastsWithoutEpisodeData.length >= 5
//         ? 5
//         : podcastsWithoutEpisodeData.length;

//     const indices = getRandomNonRepeatingIndices(
//       numEpisodesDesired,
//       podcastsWithoutEpisodeData.length
//     );

//     try {
//       let podcastPromises = [];
//       let podcastIndex, podcast;
//       for (let i = 0; i < indices.length; i++) {
//         podcastIndex = indices[i];
//         podcast = podcastsWithoutEpisodeData[podcastIndex];
//         if (podcast !== undefined) {
//           podcastPromises.push(
//             axios.get(`/api/episode/apiEpisode?id=${podcast.id}`)
//           );
//         }
//       }
//       const resolvedPodcastPromises = await Promise.all(podcastPromises);

//       const podcastsWithEpisodeData = resolvedPodcastPromises.map(
//         elem => elem.data
//       );

//       if (podcastsWithEpisodeData.length === 0) {
//         throw new Error("podcastsWithEpisodeData is empty.");
//       }
//       dispatch(setBestCategoryPodcasts(podcastsWithEpisodeData));
//       dispatch(setEpisodeLoadingStatus(false));
//     } catch (error) {
//       console.error(error);
//     }
//   };
// };

export const fetchPlayedEpisodes = channelId => {
  return async dispatch => {
    dispatch(setEpisodeLoadingStatus(true));
    let res = await axios.get(`/api/channel?id=${channelId}`);
    let playedEpisodes = res.data[0].episodes;
    const episodesObject = convertPlayedEpisodesArrayToObject(playedEpisodes);
    dispatch(setPlayedEpisodes(episodesObject));
    dispatch(setEpisodeLoadingStatus(false));
  };
};

export const addPlayedEpisode = (episode, channelId) => {
  return async dispatch => {
    dispatch(setEpisodeLoadingStatus(true));
    episode.channelId = channelId;
    try {
      let req = await axios.post("/api/episode", episode);
      let newEpisode = req.data;

      let playedEpisodeObj = {};
      playedEpisodeObj[newEpisode.title] = newEpisode;
      dispatch(setAddedPlayedEpisode(playedEpisodeObj));
      dispatch(setEpisodeLoadingStatus(false));
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchRecommendedEpisodes = channelId => {
  return async dispatch => {
    dispatch(setEpisodeLoadingStatus(true));
    try {
      let res = await axios.get("/api/episode/next", {
        params: {
          channelId: channelId
        }
      });
      let recommendedEpisode = res.data;
      dispatch(setRecommendedEpisodes(recommendedEpisode));
      dispatch(setEpisodeLoadingStatus(false));
    } catch (error) {
      console.error(error);
    }
  };
};

//REDUCER
export default function(state = initState, action) {
  switch (action.type) {
    case SET_PODCAST:
      return {
        ...state,
        podcast: action.singlePodcast
      };
    case SET_PODCAST_LIST:
      return {
        ...state,
        podcastList: action.podcastList
      };
    case SET_BEST_CATEGORY_PODCASTS:
      return {
        ...state,
        bestCategoryPodcasts: action.podcasts
      };
    case SET_REMOVED_BEST_CATEGORY_PODCAST:
      return {
        ...state,
        bestCategoryPodcasts: bestCategoryPodcasts.filter(
          podcast => podcast.id !== action.podcast.id
        )
      };
    case SET_PLAYED_EPISODES:
      return {
        ...state,
        playedEpisodes: action.episodes
      };
    case SET_ADDED_PLAYED_EPISODE:
      return {
        ...state,
        playedEpisodes: {
          ...state.playedEpisodes,
          ...action.episode
        }
      };
    case SET_RECOMMENDED_EPISODES:
      return {
        ...state,
        recommendedEpisodes: action.episodes
      };
    case SET_EPISODE_LOADING_STATUS:
      return {
        ...state,
        loading: action.status
      };
    default:
      return state;
  }
}
