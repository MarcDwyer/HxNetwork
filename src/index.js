import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ActiveList from './components/active_streams';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <div>
    <ActiveList />
    </div>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
