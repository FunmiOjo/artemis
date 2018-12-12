import React, {Component} from "react";
import {withMediaProps} from "react-media-player";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeOff from "@material-ui/icons/VolumeOff";
import IconButton from "@material-ui/core/IconButton";

class MuteUnmute extends Component {
  _handleMuteUnmute = () => {
    this.props.media.muteUnmute();
  };

  render() {
    const {
      media: {volume},
      className
    } = this.props;
    return (
      <IconButton className={className} onClick={this._handleMuteUnmute}>
        {volume >= 0.5 && <VolumeUp />}
        {volume > 0 && volume < 0.5 && <VolumeDown />}
        {volume === 0 && <VolumeOff />}
      </IconButton>
    );
  }
}

export default withMediaProps(MuteUnmute);
