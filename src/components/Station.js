import React, { Component } from 'react';

class Station extends Component {
    render() {
        return (
            <div>
                <h2><a href="#">{ this.props.name }</a></h2>
                <span>{ this.props.stopid }</span><br/>
                <span>$ { this.props.fare }</span>                      
            </div>
        )
    }
}

export default Station;