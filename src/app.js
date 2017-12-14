import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Stations from './components/Stations'

class App extends Component {

    render() {
        return (
            <div>
                Hello React!
                <Stations />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));