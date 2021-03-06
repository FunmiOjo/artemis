import React, {Component} from "react";
import {updateActiveChannelTags} from "../../reducers/channel";
import {connect} from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import Bookmark from "@material-ui/icons/Bookmark";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeOff from "@material-ui/icons/VolumeOff";
import axios from "axios";
import SoundVolume from "./SoundVolume";
import {zeroPad} from "../../utilities";

let episodeAudio = new Audio();

class AudioPlayer extends Component {
  constructor() {
    super();
    this.state = {
      isPlaying: false,
      unmute: true,
      audioLength: 0,
      audioVolume: 0.5,
      currentTime: 0,
      isBookmark: false,
      liked: false,
      disliked: false,
      cancelled: false
    };

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.like = this.like.bind(this);
    this.dislike = this.dislike.bind(this);
    this.handleMute = this.handleMute.bind(this);
    this.skip = this.skip.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.bookmark = this.bookmark.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.metaDataHandler = this.metaDataHandler.bind(this);
    this.timeUpdateHandler = this.timeUpdateHandler.bind(this);
    this.endHandler = this.endHandler.bind(this);
    this.errorHandler = this.errorHandler.bind(this);
  }

  metaDataHandler() {
    !this.state.cancelled &&
      this.setState({
        audioLength: episodeAudio.duration
      });
  }

  timeUpdateHandler() {
    !this.state.cancelled &&
      this.setState({
        currentTime: episodeAudio.currentTime
      });
  }

  endHandler() {
    this.props.handleEpisodeEnd();
    !this.state.cancelled &&
      this.setState({
        liked: false,
        disliked: false
      });
  }

  errorHandler() {
    this.props.handleEpisodeEnd();
    !this.state.cancelled &&
      this.setState({
        liked: false,
        disliked: false
      });
  }

  async componentDidMount() {
    try {
      this.setState({
        cancelled: false
      });
      const {episode} = this.props;
      episodeAudio.src = episode.audio ? episode.audio : episode.audioURL;
      episodeAudio.volume = this.state.audioVolume;

      episodeAudio.addEventListener("loadedmetadata", this.metaDataHandler);
      episodeAudio.addEventListener("timeupdate", this.timeUpdateHandler);
      episodeAudio.addEventListener("ended", this.endHandler);
      episodeAudio.addEventListener("error", this.errorHandler);

      await this.play();
    } catch (error) {
      console.error(error);
    }
  }

  componentWillUnmount() {
    !this.cancelled &&
      this.setState({
        cancelled: true
      });
    episodeAudio.removeEventListener("loadedmetadata", this.metaDataHandler);
    episodeAudio.removeEventListener("timeupdate", this.timeUpdateHandler);
    episodeAudio.removeEventListener("ended", this.endHandler);
    episodeAudio.removeEventListener("error", this.errorHandler);
  }

  async componentDidUpdate(prevProps) {
    try {
      if (this.props.episode !== prevProps.episode) {
        const {episode} = this.props;
        episodeAudio.src = episode.audio ? episode.audio : episode.audioURL;
        await this.play();
      }
    } catch (error) {
      console.error(error);
    }
  }

  handleSliderChange(event) {
    !this.state.cancelled &&
      this.setState({
        currentTime: Number(event.target.value)
      });
    episodeAudio.currentTime = Number(event.target.value);
  }

  handleVolumeChange(event) {
    !this.state.cancelled &&
      this.setState({
        audioVolume: event.target.value
      });
    episodeAudio.volume = this.state.audioVolume;
  }

  async play() {
    try {
      await episodeAudio.play();
      !this.state.cancelled &&
        this.setState({
          isPlaying: true
        });
    } catch (error) {
      console.error(error);
    }
  }

  pause() {
    episodeAudio.pause();
    !this.state.cancelled &&
      this.setState({
        isPlaying: false
      });
  }

  handleMute() {
    var stateUnmute = this.state.unmute;
    if (stateUnmute) {
      !this.state.cancelled &&
        this.setState({
          audioVolume: 0,
          unmute: !stateUnmute
        });
      episodeAudio.muted = true;
    } else {
      !this.state.cancelled &&
        this.setState({
          audioVolume: 0.1,
          unmute: !stateUnmute
        });
      episodeAudio.muted = false;
    }
  }

  skip() {
    this.props.handleSkip();
    !this.state.cancelled &&
      this.setState({
        isBookmark: false,
        isPlaying: false,
        liked: false,
        disliked: false
      });
  }

  like() {
    let isLiked = this.state.liked;
    let episode = this.props.episode;
    let epTags = this.props.tags;
    this.props.updatedActiveChannelTags(
      this.props.activeChannelId,
      "like",
      epTags,
      episode
    );
    !this.state.cancelled &&
      this.setState({
        liked: !isLiked,
        disliked: false
      });
  }

  dislike() {
    let isDisliked = this.state.disliked;
    let episode = this.props.episode;
    let epTags = this.props.tags;
    this.props.updatedActiveChannelTags(
      this.props.activeChannelId,
      "dislike",
      epTags,
      episode
    );
    !this.state.cancelled &&
      this.setState({
        disliked: !isDisliked,
        liked: false
      });
  }

  async bookmark() {
    let apiEpisode = this.props.episode;
    let databaseEpisode = this.props.databaseEpisodes[apiEpisode.title];
    let bookMarked = this.state.isBookmark;
    await axios.post("/api/bookmarks", {episodeId: databaseEpisode.id}); //FIX use Redux
    !this.state.cancelled && this.setState({isBookmark: !bookMarked});
  }

  currentTimeCalculation() {
    let timeInMin = Math.floor(this.state.currentTime / 60).toString();
    let timeInSec = Math.floor(this.state.currentTime % 60).toString();
    if (timeInMin < 10) {
      timeInMin = "0" + timeInMin;
    }
    if (timeInSec < 10) {
      timeInSec = "0" + timeInSec;
    }
    let currentTimeInStr = timeInMin + ":" + timeInSec;
    return currentTimeInStr;
  }

  render() {
    const currentTimeInString = this.currentTimeCalculation();
    const durationInMin = parseInt(episodeAudio.duration / 60, 10);
    const durationInSec = parseInt(episodeAudio.duration % 60, 10);

    return (
      <div>
        {this.state.isPlaying ? (
          <IconButton>
            <PauseIcon onClick={this.pause} />
          </IconButton>
        ) : (
          <IconButton>
            <PlayArrowIcon onClick={this.play} />
          </IconButton>
        )}
        <IconButton onClick={this.skip}>
          <SkipNextIcon />
        </IconButton>
        <IconButton>
          <ThumbUpIcon
            onClick={this.like}
            className={this.state.liked ? "material-icons orange600" : "empty"}
          />
        </IconButton>
        <IconButton>
          <ThumbDownIcon
            onClick={this.dislike}
            className={
              this.state.disliked ? "material-icons orange600" : "empty"
            }
          />
        </IconButton>
        <IconButton>
          <Bookmark
            onClick={this.bookmark}
            className={
              this.state.isBookmark ? "material-icons orange600" : "empty"
            }
          />
        </IconButton>
        <IconButton>
          {this.state.unmute ? (
            <VolumeUp onClick={this.handleMute} />
          ) : (
            <VolumeOff onClick={this.handleMute} />
          )}
        </IconButton>

        <SoundVolume
          handleVolumeChange={this.handleVolumeChange}
          audioVolume={this.state.audioVolume}
        />

        <div style={{display: "flex"}}>
          <div style={{flexGrow: "35"}}>
            <input
              type="range"
              value={this.state.currentTime}
              aria-labelledby="label"
              onChange={this.handleSliderChange}
              min={0}
              max={this.state.audioLength}
              step="any"
            />
          </div>
          {durationInMin && durationInSec ? (
            <div style={{float: "right", flexGrow: "1"}}>
              {currentTimeInString} | {zeroPad(durationInMin)}:
              {zeroPad(durationInSec)}
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    databaseEpisodes: state.podcast.playedEpisodes,
    activeChannelId: state.channel.activeChannel.id
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updatedActiveChannelTags: (channelId, method, tags, episode) =>
      dispatch(updateActiveChannelTags(channelId, method, tags, episode))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayer);
