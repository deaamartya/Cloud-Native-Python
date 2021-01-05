import React, { Component } from 'react';
import { createRef } from 'react';
import ReactDOM from 'react-dom';
import Tweet from "./components/Tweet.jsx";
import TweetList from "./components/TweetList.jsx";
import TStore from "./stores/Tstores.jsx";
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