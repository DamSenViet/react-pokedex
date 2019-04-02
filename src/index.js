import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css' // need to reset the body for cross-browser consistency
import './index.css';
import Pokedex from './components/Pokedex';

ReactDOM.render(<Pokedex />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
