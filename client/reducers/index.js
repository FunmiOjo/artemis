import {combineReducers} from "redux";
import podcast from "./podcast";
import user from "./user";
import channel from "./channel";

const reducer = combineReducers({
  podcast,
  user,
  channel
});

export default reducer;
