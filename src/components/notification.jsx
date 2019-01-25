import React, { Component } from 'react'
import _ from 'lodash'
import uuid from 'uuid'

export default class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updater: []
        }
        this.styles = {
            card: {color: 'white'}
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // finding the difference between the previous streamers and the current streamers, seeing if there is a difference (thank you lodash)
        if (prevProps.active !== this.props.active) {
            const { active } = this.props;

            const oldnames = Object.values(prevProps.active).map(stream => stream.name)
            const newnames = Object.values(active).map(stream => stream.name);

            const update = _.difference(newnames, oldnames);
            this.setState({updater: update})
            setTimeout(() => {
                this.setState({updater: []});
            }, 8500)
         }
    }

    render() {

        const {updater} = this.state;
        if (!updater.length > 0) {
            return (
                <div className='notify' style={this.styles.card}><div className="flexme"><span>No difference...</span></div></div>
            );
        }

        return (
            <div className="notify act" style={this.styles.card}>{this.updateStream()}</div>
        );
    }
    updateStream() {
        const { updater } = this.state;
        return updater.map(stream => {
            console.log(stream)
            return (
                <div key={uuid()} className="flexme">
                    <span>{stream} is online!</span>
                </div>
            );
        })
    }
}
