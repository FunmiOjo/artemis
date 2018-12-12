import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import AudioPlayer from "./AudioPlayer";

const styles = theme => ({
  card: {
    display: "flex",
    flexDirection: "column",
    minwidth: "400px",
    maxWidth: "60%",
    height: "100%"
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    display: "flex",
    alignItems: "center",

    height: 400,
    maxWidth: "400px"
  },
  actions: {
    display: "block"
  }
});

class PodcastPlayer extends Component {
  render() {
    const {
      classes,
      handleEpisodeEnd,
      episodeQueue,
      handleSkip,
      episode,
      channelId
    } = this.props;

    return (
      <div>
        <Card className={`${classes.card} `}>
          <CardMedia
            style={{
              margin: "0px 0px 0px 0px"
            }}
            className={classes.cover}
            image={
              episode.imageURL ? episode.imageURL : episode.podcastImageURL
            }
            title={episode.title}
          />
          <CardContent className={classes.content}>
            <Typography variant="headline">{episode.title}</Typography>
            <Typography variant="subheading" color="textSecondary">
              {episode.podcastTitle}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions}>
            <AudioPlayer
              audio={episode.audio ? episode.audio : episode.audioURL}
              episode={episode}
              channelId={channelId}
              episodeQueue={episodeQueue}
              handleSkip={handleSkip}
              handleEpisodeEnd={handleEpisodeEnd}
              tags={this.props.tags}
            />
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(PodcastPlayer);
