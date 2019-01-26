import React, { Component } from 'react'

 export default class VideoPlayer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            online: false,
            theStream: {
                Likes: "900000",
                Dislikes: "2 (Ice and Sam)",
                Title: "Our god is offline... watch his VOD",
                Viewers: "10000000",
                VideoID: "https://www.youtube.com/embed/jiZvsxNtmvw",
                Description: "Wow our new CEO is awesome"
            }
        }
    }
    componentDidMount() {
        if (this.props.live) {
         this.setState({online: true, theStream: Object.values(this.props.live)[0]})
        } else {
            this.setState({online: false, theStream: null})
        }
    }
     componentDidUpdate(prevProps) {
        const { live, onStream } = this.props;
        const { online, theStream } = this.state
         if (online && (onStream && !live[onStream])) {
             console.log(1)
            this.setState({theStream: live[Object.keys(live)[0]]})
        }
       else if (online && (prevProps.onStream !== this.props.onStream)) {
        console.log(2)
            this.setState({ theStream: live[onStream] })
        } else if (live !== prevProps.live && !online ) {
            console.log(3)
          this.setState({online: true, theStream: live[Object.keys(live)[0]]})
        }
    }


     render() {
        const { theStream, online } = this.state
        if (!theStream) return null
        const { Likes, Dislikes, VideoID, Viewers, Title } = theStream

        const darkTheme = this.props.theme ? 'darkTheme' : 'whiteTheme';
        const vidUrl = !online ? theStream.VideoID : `https://www.youtube.com/embed/${VideoID}?autoplay=1&amp;showinfo=0&amp;modestbranding=1&amp;enablejsapi=1&amp`;
        const url = window.location.hostname;
        const chatUrl = !online ? "" : `https://www.youtube.com/live_chat?v=${VideoID}&embed_domain=${url}`;

        
        return (

            <div className="contentmain" style={!this.props.theme ? {backgroundColor: '#D6D6D6'} : {backgroundColor: 'black'}}>
                <div className="videoparent">
                    <div className={`videonav ${darkTheme}`}>
                        <div className="marginnav">
                            <span><i className="fa fa-thumbs-up"></i> { Likes }</span>
                            <span><i className="fa fa-thumbs-down ml-4"></i> { Dislikes }</span>
                        </div>
                    </div>
                    <div className={`margincontent ${darkTheme}`}>
                        <div className="actualvideo">
                            <iframe src={vidUrl} frameBorder="0" />
                        </div>
                        <div className="topcontent">
                            <div className="videocontent mt-2">
                                <h4 className="ml-2">{ Title }</h4>
                                <span><i style={{color: 'red'}} className="fa fa-circle mr-2" />{ Viewers } Viewers</span>
                            </div>
                            <div className="body ml-2 mb-2">
                                <p>{theStream.Description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="chatter">
                <iframe className="thechat" src={chatUrl} frameBorder="0" />
                </div>
            </div>
        );
    }
}