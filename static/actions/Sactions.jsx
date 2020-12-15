import AppDispatcher from '../dispatcher.jsx';
export default{
    receivedTweets(rawTweets){
        console.log(3, "received tweets");
        AppDispatcher.dispatch({
            actionType: "RECEIVED_TWEETS",
            rawTweets
        });
    }
}