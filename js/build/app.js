'use strict';

var _Excel = require('./components/Excel');

var _Excel2 = _interopRequireDefault(_Excel);

var _Logo = require('./components/Logo');

var _Logo2 = _interopRequireDefault(_Logo);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var headers = localStorage.getItem('headers');
var data = localStorage.getItem('data');

if (!headers) {
    headers = ['Title', 'Year', 'Rating', 'Comment'];
    data = [['Test', '2015', '3', 'meh']];
}

_reactDom2.default.render(_react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
        'h1',
        null,
        _react2.default.createElement(_Logo2.default, null),
        ' Welcome to WinePad!'
    ),
    _react2.default.createElement(_Excel2.default, { headers: headers, initialData: data })
), document.getElementById('pad'));