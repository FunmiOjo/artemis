import React from "react";
import {withRouter} from "react-router";
import PodcastPlayer from "./player/PodcastPlayer";
import {connect} from "react-redux";
import axios from "axios";
import {getRandomIndex, getGenreIdFromGenreName} from "../utilities";
import {
  setSinglePodcast,
  fetchCategoryPodcastsEpisodeData,
  fetchPlayedEpisodes,
  addPlayedEpisode,
  fetchRecommendedEpisodes
} from "../reducers/podcast";
import genres from "../genreList";
import Loading from "./Loading";

class SingleChannel extends React.Component {
  constructor() {
    super();
    this.state = {
      episode: {},
      unfinishedEpisode: {},
      episodeQueue: [],
      tags: [],
      vector: []
    };
    this.getEpisodeFromQueue = this.getEpisodeFromQueue.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
    this.handleEpisodeEnd = this.handleEpisodeEnd.bind(this);
    this.addNewEpisodeToQueue = this.addNewEpisodeToQueue.bind(this);
    this.setTags = this.setTags.bind(this);
  }

  setTags = async function(episode) {
    const description = episode.description;
    const res = await axios.get("/api/keywords", {
      params: {
        input: description,
        channelId: this.props.match.params.channelId
      }
    });
    const tags = res.data;

    this.setState({
      tags
    });
  };

  async componentDidMount() {
    const {channelId} = this.props.match.params;
    await this.getGenrePodcasts();
    await this.props.fetchPlayedEpisodes(channelId);
    await this.props.fetchRecommendedEpisodes(channelId);

    const mostRecentlyPlayedEpisode = this.extractMostRecentlyPlayedEpisode();
    this.setState({
      mostRecentlyPlayedEpisode
    });

    const episodeQueue = this.getEpisodeQueue(5);
    this.setState({
      episodeQueue
    });

    const newEpisode = this.getEpisodeFromQueue();
    this.setTags(newEpisode);
    this.setState({
      episode: newEpisode
    });
    await this.props.addPlayedEpisode(newEpisode, channelId);
  }

  async getGenrePodcasts() {
    const {data: channel} = await axios.get(
      `/api/channel/${this.props.match.params.channelId}`
    );
    const genreId = getGenreIdFromGenreName(channel.name, genres);
    const {data: podcastsWithoutData} = await axios.get(
      `/api/podcast?id=${genreId}`
    );

    await this.props.fetchCategoryPodcastsEpisodeData(
      podcastsWithoutData.channels
    );
  }

  extractMostRecentlyPlayedEpisode() {
    let episodes = Object.keys(this.props.playedEpisodes).map(key => {
      return this.props.playedEpisodes[key];
    });

    let episodeDates = episodes.map(episode =>
      new Date(episode.date).getTime()
    );

    let currentEpisodeDate = Math.min(...episodeDates);
    let currentEpisode = episodes.find(
      episode => new Date(episode.date).getTime() === currentEpisodeDate
    );
    return currentEpisode;
  }

  async getNewEpisodeFromRecommendedEpisodes() {
    const channelId = this.props.match.params.channelId;
    let episode = await this.props.fetchRecommendedEpisodes(channelId);
    return episode;
  }

  getNewEpisodeFromCategoryPodcast() {
    const {bestCategoryPodcasts} = this.props;
    let counter = 0;
    let podcastIndex, podcast, episodeIndex, episode;

    while (!this.episodeHasNotBeenPlayed(episode)) {
      podcastIndex = getRandomIndex(bestCategoryPodcasts.length);
      podcast = bestCategoryPodcasts[podcastIndex];

      episodeIndex = getRandomIndex(podcast.episodes.length);
      episode = podcast.episodes[episodeIndex];
      episode.podcastTitle = podcast.title;
      episode.podcastImageURL = podcast.image;

      counter++;
      if (counter > 50) {
        this.getGenrePodcasts();
        return episode;
      }
    }
    return episode;
  }

  episodeHasNotBeenPlayed(episode) {
    if (episode === undefined) {
      return false;
    }

    if (this.props.playedEpisodes[episode.title] !== undefined) {
      return false;
    }

    return true;
  }

  getNewEpisode() {
    let newEpisode;
    if (!this.props.recommendedEpisode) {
      newEpisode = this.getNewEpisodeFromCategoryPodcast();
    } else {
      // gets new recommended episodes
      newEpisode = this.getNewEpisodeFromRecommendedEpisodes();
    }
    return newEpisode;
  }

  getEpisodeQueue(numDesiredEpisodes) {
    const queue = [];

    let newEpisode;
    const mostRecentlyPlayedEpisode = this.state.mostRecentlyPlayedEpisode;

    if (mostRecentlyPlayedEpisode) {
      queue.push(this.state.mostRecentlyPlayedEpisode);
    }
    const hasSameTitle = episode => episode.title === newEpisode.title;

    while (queue.length < numDesiredEpisodes) {
      newEpisode = this.getNewEpisode();
      let sameTitles = queue.filter(hasSameTitle);
      if (sameTitles.length === 0) {
        queue.push(this.getNewEpisode());
      }
    }

    return queue;
  }

  addNewEpisodeToQueue() {
    let newEpisode = this.getNewEpisode();
    const hasSameTitle = episode => episode.title === newEpisode.title;
    while (this.state.episodeQueue.filter(hasSameTitle).length > 0) {
      newEpisode = this.getNewEpisode();
    }
    this.setState({
      episodeQueue: [...this.state.episodeQueue, newEpisode]
    });
  }

  getEpisodeFromQueue() {
    const queueCopy = this.state.episodeQueue.slice(0);
    const episode = queueCopy.shift();
    this.setState({
      episodeQueue: queueCopy
    });
    return episode;
  }

  async handleEpisodeEnd() {
    //add episode that just ended to played episodes
    const channelId = this.props.match.params.channelId;

    //get new episode from queue
    const newEpisode = this.getEpisodeFromQueue();
    await this.props.addPlayedEpisode(newEpisode, channelId);
    this.setTags(newEpisode);
    this.setState({
      episode: newEpisode
    });
    this.addNewEpisodeToQueue();
  }

  async handleSkip() {
    //add episode that was playing before skip to played episodes
    const channelId = this.props.match.params.channelId;

    //get new episode
    const newEpisode = this.getEpisodeFromQueue();
    await this.props.addPlayedEpisode(newEpisode, channelId);
    this.setTags(newEpisode);
    this.setState({
      episode: newEpisode
    });
    this.addNewEpisodeToQueue();
  }

  render() {
    if (this.props.loading) {
      return <Loading />;
    }
    if (this.state.episode.audio || this.state.episode.audioURL) {
      return (
        <PodcastPlayer
          episode={this.state.episode}
          episodeQueue={this.state.episodeQueue}
          handleSkip={this.handleSkip}
          handleEpisodeEnd={this.handleEpisodeEnd}
          channelId={this.props.match.params.channelId}
          setNewEpisode={this.setNewEpisode}
          tags={this.state.tags}
        />
      );
    }
    return <div />;
  }
}

const mapStateToProps = state => {
  return {
    bestCategoryPodcasts: state.podcast.bestCategoryPodcasts,
    recommendedEpisodes: state.podcast.recommendedEpisodes,
    playedEpisodes: state.podcast.playedEpisodes,
    episodeId: state.podcast.podcast.id,
    loading: state.podcast.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCategoryPodcastsEpisodeData: podcasts =>
      dispatch(fetchCategoryPodcastsEpisodeData(podcasts)),
    fetchPlayedEpisodes: channelId => dispatch(fetchPlayedEpisodes(channelId)),
    addPlayedEpisode: (episode, channelId) =>
      dispatch(addPlayedEpisode(episode, channelId)),
    fetchRecommendedEpisodes: channelId =>
      dispatch(fetchRecommendedEpisodes(channelId)),
    setSinglePodcast: episode => dispatch(setSinglePodcast(episode))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SingleChannel)
);
