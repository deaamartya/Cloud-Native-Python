import React, { Component } from 'react';
import { createRef } from 'react';
import ReactDOM from 'react-dom';
import Tweet from "./components/Tweet.jsx";
import TweetList from "./components/TweetList.jsx";
import TStore from "./stores/Tstores.jsx";
// class Main extends Component{
//   constructor(){
//     super();
//     this.state = { userId: 1 };
//     this.state = { tweets: [] };
//     this.getData = this.getData.bind(this);
//   }

//   getData() {
//     var self=this;
//     $.getJSON('/api/v2/tweets', function(tweetModels) {
//       self.setState({tweets: tweetModels})
//     });
//   }

//   componentDidMount(){
//     this.getData()
//   }

//   addTweet(tweet){
//     var self = this
//     $.ajax({
//       url: '/api/v2/tweets',
//       contentType: 'application/json',
//       type: 'POST',
//       data: JSON.stringify({
//       'body': tweet,
//       }),
//       success: function(data) {
//         self.getData()
//       }
//     });
//   }

//   updatetweets(tweets){
//     let updatelist = tweets.map(tweet => {
//       tweet.updatedate = moment(tweet.timestamp).fromNow();
//       return tweet;
//     });
//   }
  
//   render(){
//     return (
//       <div>
//         <Tweet sendTweet={this.addTweet.bind(this)}/>
//         <TweetList tweets={this.state.tweets}/>
//       </div>
//     );
//   }
// }

import TActions from "./actions/Tactions.jsx";

TActions.getAllTweets();

let getAppState = () =>{
  return { tweetslist: TStore.getAll()};
}

class Main extends React.Component{
  constructor(props){
    super(props);
    this.state= getAppState();
    this._onChange = this._onChange.bind(this);
  //defining the state of component.
  }
  // function to pull tweets
  componentDidMount() {
    TStore.addChangeListener(this._onChange);
  }
  componentWillUnMount() {
    TStore.removeChangeListener(this._onChange);
  }
  _onChange(){
    this.setState(getAppState());
  }

  render(){
    return (
      <div>
        <Tweet />
        <TweetList tweet={this.state.tweetslist}/>
      </div>
    );
  }
  
}

let documentReady =() =>{
    ReactDOM.render(
      <Main />,
      document.getElementById('react')
    );
  };

$(documentReady);