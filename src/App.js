import React, { Component } from 'react';
import { Button } from 'antd';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
    render() {
        return (
            <div className="App">
                <Button type="primary">Button</Button>
            </div>
        );
    }
}

export default App;
