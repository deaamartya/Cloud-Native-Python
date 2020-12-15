import { createRef } from 'react'
import TActions from "../actions/Tactions.jsx"

export default class Tweet extends React.Component {
    constructor(props) {
        super(props);
        this.tweetTextArea = createRef();
    }

    sendTweet(event){
        event.preventDefault();
        // this.props.sendTweet(this.tweetTextArea.current.value);
        TActions.sendTweet(this.tweetTextArea.current.value);
        this.tweetTextArea.current.value = '';
    }

    render(){
        return(
            <div className="row">
                <form onSubmit={this.sendTweet.bind(this)}>
                    <div className="input-field">
                        <textarea ref={this.tweetTextArea} className="materialize-textarea"/>
                        <label>How you doing?</label>
                        <button className="btn waves-effect waves-light right">Tweet now <i className="material-icons right">send</i></button>
                    </div>
                </form>
            </div>
        );
    }
}