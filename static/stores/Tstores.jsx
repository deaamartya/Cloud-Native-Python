import { EventEmitter } from "events";
import ActionTypes from "../constants.jsx";
import AppDispatcher from '../dispatcher.jsx';
import moment from "moment-timezone";

let _tweets = []
const CHANGE_EVENT = "CHANGE";
class TweetEventEmitter extends EventEmitter{
    getAll(){
        moment.tz.setDefault("Asia/Jakarta");
        let updatelist = _tweets.map(tweet => {
            var time = moment(tweet.timestamp).subtract("07:00");
            tweet.updatedate = time.fromNow();
            return tweet;
        });
        return _tweets;
    }
    emitChange(){
        this.emit(CHANGE_EVENT);
    }
    addChangeListener(callback){
        this.on(CHANGE_EVENT, callback);
    }
    removeChangeListener(callback){
        this.removeListener(CHANGE_EVENT, callback);
    }
}

let TStore = new TweetEventEmitter();

AppDispatcher.register(action =>{
    switch (action.actionType) {
      case ActionTypes.RECEIVED_TWEETS:
          // console.log(4, "Tstore for tweets");
          _tweets = action.rawTweets;
          // console.log(6, _tweets[0]);
          TStore.emitChange();
        break;
      case ActionTypes.RECEIVED_TWEET:
          _tweets.unshift(action.rawTweet);
          TStore.emitChange();
        break;
      default:
    }
});

export default TStore;