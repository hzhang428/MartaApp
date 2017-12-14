import React, { Component } from 'react';
import Station from './Station';

class Stations extends Component {
    render() {
        return (
            <div>
                <ol>
                    <li><Station name="Station 1" fare="5" stopid="N1"/></li>
                    <li><Station name="Station 2" fare="6" stopid="N2"/></li>
                    <li><Station name="Station 3" fare="7" stopid="N3"/></li>
                    <li><Station name="Station 4" fare="8" stopid="N4"/></li>
                </ol>
            </div>
        )
    }
}

export default Stations;