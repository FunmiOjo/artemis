import React from "react";
import {withRouter} from "react-router";
import PodcastPlayer from "./player/PodcastPlayer";
import {connect} from "react-redux";
import axios from "axios";
import {fetchActiveChannel} from "../reducers/channel";
import {
  setSinglePodcast,
  fetchCategoryPodcasts,
  fetchPlayedEpisodes,
  addPlayedEpisode,
  fetchRecommendedEpisodes,
  setRemovedBestCategoryPodcast
} from "../reducers/podcast";
import Loading from "./Loading";

class SingleChannel extends React.Component {
  constructor() {
    super();
    this.state = {
      episode: {},
      episodeQueue: [],
      tags: []
    };
    this.handleSkip = this.handleSkip.bind(this);
    this.handleEpisodeEnd = this.handleEpisodeEnd.bind(this);
    this.setTags = this.setTags.bind(this);
  }

  async componentDidMount() {
    const {channelId} = this.props.match.params;
    await this.props.fetchActiveChannel(channelId);
    await this.props.fetchCategoryPodcasts(this.props.channelName);
    await this.props.fetchPlayedEpisodes(channelId);
    await this.props.fetchRecommendedEpisodes(channelId);

    const newEpisode = this.getNewEpisode();
    this.setTags(newEpisode);
    this.setState({
      episode: newEpisode
    });
    await this.props.addPlayedEpisode(newEpisode, channelId);
  }

  async componentDidUpdate(prevProps) {
    if (
      this.props.bestCategoryPodcasts.length !==
      prevProps.bestCategoryPodcasts.length
    ) {
      if (this.props.bestCategoryPodcasts < 2) {
        await this.props.fetchCategoryPodcasts(this.props.channelName);
      }
    }
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

  async getNewEpisodeFromRecommendedEpisodes() {
    const channelId = this.props.match.params.channelId;
    let episode = await this.props.fetchRecommendedEpisodes(channelId);
    return episode;
  }

  getNewEpisodeFromCategoryPodcast() {
    const {bestCategoryPodcasts} = this.props;
    const episode = bestCategoryPodcasts[0];
    this.props.removePodcast(bestCategoryPodcasts[0]);
    return episode;
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

  async handleEpisodeEnd() {
    //add episode that just ended to played episodes
    const channelId = this.props.match.params.channelId;

    //get new episode from queue
    const newEpisode = this.getNewEpisode();
    await this.props.addPlayedEpisode(newEpisode, channelId);
    this.setTags(newEpisode);
    this.setState({
      episode: newEpisode
    });
  }

  async handleSkip() {
    //add episode that was playing before skip to played episodes
    const channelId = this.props.match.params.channelId;

    //get new episode
    const newEpisode = this.getNewEpisode();
    await this.props.addPlayedEpisode(newEpisode, channelId);
    this.setTags(newEpisode);
    this.setState({
      episode: newEpisode
    });
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
    channelName: state.channel.activeChannel.name,
    recommendedEpisodes: state.podcast.recommendedEpisodes,
    playedEpisodes: state.podcast.playedEpisodes,
    episodeId: state.podcast.podcast.id,
    loading: state.podcast.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchActiveChannel: channelId => dispatch(fetchActiveChannel(channelId)),
    fetchCategoryPodcasts: genre => dispatch(fetchCategoryPodcasts(genre)),
    fetchPlayedEpisodes: channelId => dispatch(fetchPlayedEpisodes(channelId)),
    addPlayedEpisode: (episode, channelId) =>
      dispatch(addPlayedEpisode(episode, channelId)),
    fetchRecommendedEpisodes: channelId =>
      dispatch(fetchRecommendedEpisodes(channelId)),
    removePodcast: podcast => dispatch(setRemovedBestCategoryPodcast(podcast)),
    setSinglePodcast: episode => dispatch(setSinglePodcast(episode))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SingleChannel)
);
