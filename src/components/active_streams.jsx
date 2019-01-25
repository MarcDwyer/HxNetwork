import React, { Component } from 'react'
import StreamList from './streamlist';
import { Navbar } from './nav';
import VideoPlayer from './videoplayer';
import Notifications from './notification'
import uuid from 'uuid';

export default class ActiveStreams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            live: null,
            stream: null,
            dark: true
        }
    }
    async componentDidMount() {
        const ls = JSON.parse(localStorage.getItem('dark'));
        // setting theme
        if (typeof ls === 'boolean') {
            this.setState({dark: ls})
        }
        // fetching streamer data
        const fetchData = await fetch('/streamers/live');
        const data = await fetchData.json();
        const newData = data.reduce((obj, item) => {
            obj[item.ChannelID] = item
            return obj
        },{})
        this.setState({live: newData});

        // streamer data updates, local state is set as an object
        this.checker = setInterval(async () => {

            const fetchData = await fetch('/streamers/live');
            const data = await fetchData.json();
            const newData = data.reduce((obj, item) => {
                obj[item.ChannelID] = item
                return obj
            },{})
            this.setState({live: newData});
        }, 35000);
    }
    // setting root variables to match theme
    componentDidUpdate(prevProps, prevState) {
        const { dark } = this.state;
        if (dark !== prevState.dark) {
            const darkhover = dark ? '#404040' : '#D6D6D6';
           document.documentElement.style.setProperty('--streamhover', darkhover);
        }
    }

    render() {
        const { live } = this.state;
        console.log(this.state)
        if (!live) return null;

        const darkTheme = this.state.dark ? 'darkTheme' : 'whiteTheme';

        return (
            <div>
                <Navbar toggle={this.toggleTheme} theme={this.state.dark} live={live} />
            <div className={`maindiv ${darkTheme}`}>
            <div className="navigator">
                <div className="streamlist active">
                <h5 className="online ml-2">Online <small>{Object.keys(this.state.live).length}</small></h5>

                    <div className="actuallist">
                    {this.renderStreams()}
                    </div>
                    <StreamList theme={this.state.dark} />
                </div>
            </div>
       <VideoPlayer onStream={this.state.stream} live={this.state.live} theme={this.state.dark} />
                <Notifications active={this.state.live} />
            </div>
            </div>
        );
    }
    renderStreams() {
        const { live } = this.state;
        return Object.values(live).map(stream => {
            const avatar = `https://s3.us-east-2.amazonaws.com/fetchappbucket/images/${stream.Name}.jpg`;
            const { Viewers } = stream;
            return (
                <div className="streamer mt-1" key={uuid()} onClick={() => this.setState({stream: stream.ChannelID})}>
                <div className="substreamer">
                <img src={avatar} alt="streamimage" className="ml-2" />
                <div className="streamname ml-2 ">
                <span>{stream.Name}</span>
                <span><small>is Playing IRL</small></span>
                </div>
                <span className="marginme"><small>{Viewers} viewers</small></span>  
                </div>
                </div>
            );
        })
    }
    toggleTheme = () => {
        // saving theme setting to localstorage
        localStorage.setItem('dark', JSON.stringify(!this.state.dark))
        this.setState({dark: !this.state.dark})
    }
}