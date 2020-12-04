import React, { Component } from 'react';
import { createRef } from 'react';
import ReactDOM from 'react-dom';
import Tweet from "./components/Tweet";
import TweetList from "./components/TweetList";
class Main extends Component{
  constructor(){
    super();
    this.state = { userId: 1 };
    this.state = { tweets: [] };
    this.getData = this.getData.bind(this);
  }

  getData() {
    var self=this;
    $.getJSON('/api/v2/tweets', function(tweetModels) {
      self.setState({tweets: tweetModels})
    });
  }

  componentDidMount(){
    this.getData()
  }

  addTweet(tweet){
    var self = this
    $.ajax({
      url: '/api/v2/tweets',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify({
      'tweetedby': "deaamartya",
      'body': tweet,
      }),
      success: function(data) {
        self.getData()
      }
    });
  }
  
  render(){
    return (
      <div>
        <Tweet sendTweet={this.addTweet.bind(this)}/>
        <TweetList tweets={this.state.tweets}/>
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