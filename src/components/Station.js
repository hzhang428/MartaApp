import React, { Component } from 'react';

class Station extends Component {
    render() {
        return (
            <div>
                <h2><a href="#">{ this.props.currentStation.name }</a></h2>
                <span>{ this.props.currentStation.stopid }</span><br/>
                <span>$ { this.props.currentStation.fare }</span>                      
            </div>
        )
    }
}

export default Station;