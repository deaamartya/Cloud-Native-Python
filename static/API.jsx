import SActions from './actions/Sactions.jsx';
export default{
    getAllTweets(){
        console.log(2, "API get tweets");
        $.getJSON('/api/v2/tweets', function(tweetModels) { 
            var t = tweetModels
            SActions.receivedTweets(t)
        });
    },
    addTweet(body, user){
        $.ajax({
              url: '/api/v2/tweets',
              contentType: 'application/json',
              type: 'POST',
              data: JSON.stringify({
                'body': body,
              }),
              success: function() {
                rawTweet => SActions.receivedTweet({ tweetedby: user,body: tweet, timestamp: Date.now});
              },
              error: function() {
                    return console.log("Failed");
            }
        });
      }
}