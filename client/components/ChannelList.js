import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import ChannelListItem from "./ChannelListItem";
import {List, Paper, ListItem, ListItemText} from "@material-ui/core";
import {fetchUserChannels} from "../reducers/channel";
import history from "../history";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
  list: {
    backgroundColor: "rgba(255,255,255,0.3)"
  },
  link: {
    color: theme.palette.secondary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    },
    "&visited": {
      color: theme.palette.secondary.main
    },
    "&active": {
      color: theme.palette.secondary.main
    },
    "&focus": {
      color: theme.palette.secondary.main
    }
  }
});

class ChannelList extends Component {
  constructor() {
    super();
    this.state = {
      differentChannelSelected: false,
      channelId: ""
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(channelId) {
    history.push(`/channel/${channelId}`);
  }

  componentDidMount() {
    this.props.fetchUserChannels(this.props.userId);
  }

  render() {
    const {channels, classes} = this.props;

    return (
      <Paper className={classes.list}>
        <List>
          {channels.length > 0 ? (
            channels.map(channel => (
              <ChannelListItem
                key={channel.id}
                channel={channel}
                handleClick={() => this.handleClick(channel.id)}
              />
            ))
          ) : (
            <div>
              <ListItem>
                <ListItemText>
                  <Link className={classes.link} to="/createchannel">
                    Create a channel
                  </Link>{" "}
                  to get started!
                </ListItemText>
              </ListItem>
            </div>
          )}
        </List>
      </Paper>
    );
  }
}

const mapState = state => {
  return {
    channels: state.channels.userChannels,
    userId: state.user.id
  };
};

const mapDispatch = dispatch => {
  return {
    fetchUserChannels: userId => dispatch(fetchUserChannels(userId))
  };
};

export default withStyles(styles)(
  connect(
    mapState,
    mapDispatch
  )(ChannelList)
);
