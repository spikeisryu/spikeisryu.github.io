'use strict';

import Excel from './components/Excel';
import Logo from './components/Logo';
import React from 'react';
import ReactDOM from 'react-dom';

var headers = localStorage.getItem('headers');
var data = localStorage.getItem('data');

if (!headers) {
    headers = ['Title', 'Year', 'Rating', 'Comment'];
    data = [['Test', '2015', '3', 'meh']];
}

ReactDOM.render(
    <div>
        <h1>
            <Logo/> Welcome to WinePad!
        </h1>
        <Excel headers={headers} initialData={data}/>
    </div>,
    document.getElementById('pad')
);