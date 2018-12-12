import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter, Route, Switch} from "react-router-dom";
import Home from "./components/Home";
import ChannelList from "./components/ChannelList";
import PodcastPlayer from "./components/player/PodcastPlayer";
import CreateChannel from "./components/CreateChannel";
import Channel from "./components/Channel";
import {me} from "./reducers/user";
import Bookmark from "./components/Bookmark";
import BookmarkPlayer from "./components/BookmarkPlayer";
import SignupPage from "./components/SignupPage";

class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const {isLoggedIn} = this.props;

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={SignupPage} />
        {isLoggedIn && (
          <Switch>
            <Route exact path="/allchannels" component={ChannelList} />
            <Route exact path="/podcastplayer" component={PodcastPlayer} />
            <Route exact path="/bookmarkplayer" component={BookmarkPlayer} />
            <Route exact path="/createchannel" component={CreateChannel} />
            <Route exact path="/channel/:channelId" component={Channel} />
            <Route exact path="/bookmarks" component={Bookmark} />
          </Switch>
        )}
        {/* Displays our Login component as a fallback */}
        <Route component={Home} />
      </Switch>
    );
  }
}

/**
 * CONTAINER
 */

const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  };
};

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me());
    }
  };
};

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(Routes)
);
