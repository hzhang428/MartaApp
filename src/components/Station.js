import React, { Component } from 'react';
import styles from './styles';

class Station extends Component {
    render() {
        const stationStyle = styles.station;        
        return (
            <div style={stationStyle.container}>
                <h2 style={stationStyle.header}>
                    <a style={stationStyle.title} href="#">{ this.props.currentStation.name }</a>
                </h2>
                <span>{ this.props.currentStation.stopid }</span><br/>
                <span>$ { this.props.currentStation.fare }</span>                      
            </div>
        )
    }
}

export default Station;