import React, { Component } from 'react';
import styles from './styles';

class Station extends Component {
    render() {
        return (
            <div style={styles.container}>
                <h2 style={styles.header}>
                    <a style={styles.title} href="#">{ this.props.currentStation.name }</a>
                </h2>
                <span>{ this.props.currentStation.stopid }</span><br/>
                <span>$ { this.props.currentStation.fare }</span>                      
            </div>
        )
    }
}

export default Station;