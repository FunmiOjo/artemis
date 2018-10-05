import axios from 'axios';

// ACTION TYPES
const SET_USER_CHANNELS = 'SET_USER_CHANNELS';
const SET_USER_CHANNELS_ERROR_STATUS = 'SET_USER_CHANNELS_ERROR_STATUS';
const SET_USER_CHANNELS_LOADING_STATUS = 'SET_USER_CHANNELS_LOADING_STATUS';
const GOT_ACTIVE_CHANNEL = 'GOT_ACTIVE_CHANNEL';
const UPDATED_ACTIVE_CHANNEL_TAGS = 'UPDATED_ACTIVE_CHANNEL_TAGS';

//ACTION CREATORS
const setUserChannels = userChannels => {
  return {
    type: SET_USER_CHANNELS,
    userChannels
  };
};

const setUserChannelsErrorStatus = status => {
  return {
    type: SET_USER_CHANNELS_ERROR_STATUS,
    status
  };
};

const setUserChannelsLoadingStatus = status => {
  return {
    type: SET_USER_CHANNELS_LOADING_STATUS,
    status
  };
};

const gotActiveChannel = channel => {
  return {
    type: GOT_ACTIVE_CHANNEL,
    channel
  };
};

const updatedActiveChannelTags = channel => {
  return {
    type: UPDATED_ACTIVE_CHANNEL_TAGS,
    channel
  };
};

// THUNK CREATORS
export const fetchUserChannels = userId => {
  return async dispatch => {
    dispatch(setUserChannelsLoadingStatus(true));
    try {
      const { data: userChannels } = await axios.get(`/api/channel/user`);
      dispatch(setUserChannels(userChannels));
      dispatch(setUserChannelsLoadingStatus(false));
      dispatch(setUserChannelsErrorStatus(false));
    } catch (err) {
      dispatch(setUserChannelsLoadingStatus(false));
      dispatch(setUserChannelsErrorStatus(true));
      console.error(err);
    }
  };
};

export const getActiveChannel = channelId => {
  return async dispatch => {
    try {
      const { data: channel } = await axios.get(`/api/channel/${channelId}`);
      dispatch(gotActiveChannel(channel));
    } catch (err) {
      console.error(err);
    }
  };
};

export const updateActiveChannelTags = (channelId, method, epTags) => {
  console.log('From reducers, channelId', channelId);
  return async dispatch => {
    try {
      const { data: channel } = await axios.put(
        `/api/channel/${channelId}/tags`,
        {
          id: channelId,
          method: method,
          tags: epTags
        }
      );
      dispatch(updatedActiveChannelTags(channel));
    } catch (err) {
      console.error(err);
    }
  };
};

// REDUCER
const initialState = {
  userChannels: [],
  userChannelsError: false,
  userChannelsLoading: false,
  activeChannel: {} // TODO Should we access channel's tags from this object or create a tags property in this state?
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_CHANNELS:
      return {
        ...state,
        userChannels: action.userChannels
      };
    case SET_USER_CHANNELS_LOADING_STATUS:
      return {
        ...state,
        userChannelsLoading: action.status
      };
    case SET_USER_CHANNELS_ERROR_STATUS:
      return {
        ...state,
        userChannelsError: action.status
      };
    case GOT_ACTIVE_CHANNEL: {
      return {
        ...state,
        activeChannel: action.channel
      };
    }
    case UPDATED_ACTIVE_CHANNEL_TAGS: {
      return {
        ...state,
        activeChannel: action.channel
      };
    }
    default:
      return state;
  }
};

export default reducer;
