import React from "react";
import {Redirect} from "react-router";
import axios from "axios";
import {withStyles} from "@material-ui/core/styles";
import {GridListTile, GridListTileBar, ButtonBase} from "@material-ui/core";

const styles = theme => ({
  bookmarkTitle: {
    backgroundColor: "rgba(115, 153, 158, 0.8)",
    height: "40%"
  },
  bookmark: {
    margin: 8
  },
  tile: {
    width: 300,
    height: 300
  }
});

class BookmarkItem extends React.Component {
  constructor() {
    super();
    this.state = {
      singleEpisode: {},
      cliked: false
    };
    this.playBookmark = this.playBookmark.bind(this);
  }
  async componentDidMount() {
    let res = await axios.get(`/api/episode/${this.props.episode.episodeId}`);
    let singleEpisode = res.data;
    this.setState({
      singleEpisode: singleEpisode
    });
  }

  playBookmark() {
    this.setState({
      cliked: true
    });
  }
  render() {
    const {classes} = this.props;
    const singleEp = this.state.singleEpisode;

    if (this.state.cliked) {
      return (
        <Redirect
          to={{
            pathname: "/bookmarkplayer",
            state: {
              episode: singleEp
            }
          }}
        />
      );
    } else {
      return (
        <ButtonBase
          focusRipple
          className={classes.bookmark}
          onClick={this.playBookmark}
        >
          <GridListTile className={classes.tile}>
            <img
              src={
                singleEp.imageURL ? singleEp.imageURL : singleEp.podcastImageURL
              }
              alt={singleEp.title}
            />
            <GridListTileBar
              className={classes.bookmarkTitle}
              title={singleEp.title}
              subtitle={<span>{singleEp.podcastTitle}</span>}
            />
          </GridListTile>
        </ButtonBase>
      );
    }
  }
}

export default withStyles(styles)(BookmarkItem);
