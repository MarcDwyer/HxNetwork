import React, { Component } from 'react'

 export default class VideoPlayer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            theStream: null
        }
    }
    componentDidMount() {
        if (this.props.live) {
         this.setState({theStream: Object.values(this.props.live)[0]})
        }
    }
     componentDidUpdate(prevProps, prevState, snapshot) {
        const { live, onStream } = this.props;
        const { theStream } = this.state;
       // const { theStream } = this.state
         if (onStream && !live[onStream]) {
             console.log('first')
            this.setState({theStream: live[Object.keys(live)[0]]})
        }
       else if (prevProps.onStream != this.props.onStream) {
        console.log('second')
            this.setState({ theStream: live[onStream] })
        }
    }


     render() {
        console.log(this.state)
        console.log(this.props)
        const { theStream } = this.state

        if (!theStream) return null
        const { Likes, Dislikes, VideoID, Viewers, Title } = theStream

        const darkTheme = this.props.theme ? 'darkTheme' : 'whiteTheme';
        const vidUrl = `https://www.youtube.com/embed/${VideoID}?autoplay=1&amp;showinfo=0&amp;modestbranding=1&amp;enablejsapi=1&amp`;
        const url = window.location.hostname;
        const chatUrl = `https://www.youtube.com/live_chat?v=${VideoID}&embed_domain=${url}`;

        
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
                    <iframe src={chatUrl} frameBorder="0" />
                </div>
            </div>
        );
    }
}