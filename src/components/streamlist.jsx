import React, { Component } from 'react';
import uuid from 'uuid';

export default class StreamList extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            list: null,
            show: false
        }
    }
    async componentDidMount() {
        // fetching streamer catalog from server
       const fetchData = await fetch('/streamers/all');
       const dataFetch = await fetchData.json();
       this.setState({list: dataFetch});
    }
    render() {

        const { list, show } = this.state;
        if (!list) return null;
       return (
       <div>
           <div className="header">
        <h5 className="ml-2 mt-2">Catalog <small>{Object.keys(this.state.list).length}</small></h5>
        <span className="showmore ml-2" onClick={() => this.setState({show: !show})}>{show ? 'Show less' : 'Show more'}</span>
        </div>
        <div className="actuallist">
        {this.renderStreams()}
        </div>
        </div>
       );
    }
    renderStreams(){
        const { list, show } = this.state;
        return list.map((stream, index) => {
            const avatar = `https://s3.us-east-2.amazonaws.com/fetchappbucket/images/${stream.Name}.jpg`;
            if (!show && index >= 6) return;
            return (
            <div className="streamer" key={uuid()}
            onClick={() => {
                const youtubeLink = `https://www.youtube.com/channel/${stream.ChannelId}`;
                const win = window.open(youtubeLink, '_blank');
                win.focus();
            }}
            >
            <div className="substreamer">
            <img src={avatar} alt="streamimage" className="ml-2" />
            <div className="streamname ml-2 ">
            <span>{stream.Name}</span>
            </div>
            </div>
            </div>
            );
        })
    }
}
