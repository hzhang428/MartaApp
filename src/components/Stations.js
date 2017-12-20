import React, { Component } from 'react';
import Station from './Station';

class Stations extends Component {
    constructor() {
        super();
        this.station = {
            list: [
                { name: "Station 1", fare: 5, stopid: "N1"},
                { name: "Station 2", fare: 6, stopid: "N2"},
                { name: "Station 3", fare: 7, stopid: "N3"},
                { name: "Station 4", fare: 8, stopid: "N4"},
                { name: "Station 5", fare: 9, stopid: "N5"}
            ]
        }
    }
    render() {
        const stations = this.station.list.map((s, i) => {
            return (
                <li><Station currentStation={s}/></li>
            )
        });

        return (
            <div>
                <ul>
                    { stations }
                </ul>
            </div>
        )
    }
}

export default Stations;