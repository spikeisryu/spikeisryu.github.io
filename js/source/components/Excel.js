import React from 'react';

var Excel = React.createClass({
    displayName: 'Excel',
    _preSearchData: null,
    _log: [],
    propTypes: {
        headers: React.PropTypes.arrayOf(React.PropTypes.string),
        initialData: React.PropTypes.array,
    },
    getInitialState: function() {
        return {
            data: this.props.initialData,
            sortby: null,
            descending: false,
            edit: null, // {row: index, cell: index}
            search: false,
            };
    },
    _logSetState: function(newState) {
        var log = JSON.stringify(this._log.length === 0 ? this.state : newState);
        this._log.push(JSON.parse(log));
        this.setState(newState);
    },
    _sort: function(e) {
        var column = e.target.cellIndex;
        var data = this.state.data.slice();
        var descending = this.state.sortby === column && !this.state.descending;
        data.sort(function(a, b) {
            return descending ? (a[column] < b[column] ? 1 : -1) : (a[column] > b[column] ? 1 : -1);
        });
        this._logSetState({
            data: data,
            sortby: column,
            descending: descending,
            });
    },
    _showEditor: function(e) {
        this._logSetState({
            edit: { row: parseInt(e.target.dataset.row, 10), cell: e.target.cellIndex }
        });
    },
    _save: function(e) {
        e.preventDefault();
        var input = e.target.firstChild;
        var data = this.state.data.slice();
        data[this.state.edit.row][this.state.edit.cell] = input.value;
        this._logSetState({edit: null, data: data});
    },
    _toogleSearch: function(e) {
        if (this.state.search) {
            this._logSetState({data: this._preSearchData, search: false});
            this._preSearchData = null;
        } else {
            this._preSearchData = this.state.data;
            this._logSetState({search: true});
        }
    },
    _search: function(e) {
        var needle = e.target.value.toLowerCase();
        if (!needle) {
            this._logSetState({data: this._preSearchData});
            return;
        }
        var idx = e.target.dataset.idx;
        data = this.state.data; // search in searched data
        var searchData = data.filter(function(row){
            return row[idx].toString().toLowerCase().indexOf(needle) > -1;
        });
        this._logSetState({data: searchData});
    },
    _download: function(format, ev) {
        var contents = format === 'json'
        ? JSON.stringify(this.state.data)
        : this.state.data.reduce(function(result, row) {
            return result + row.reduce(function(rowresult, cell, idx) {
                return rowresult + '"' + cell.replace(/"/g, '""') + '"' + (idx < row.length - 1 ? ',' : '');
            }, '') + '\n';
        }, '');

        var URL = window.URL || window.webkitURL;
        var blob = new Blob([contents], {type: 'text/' + format});
        ev.target.href = URL.createObjectURL(blob);
        ev.target.download = 'data.' + format;
    },
    _renderToolbar: function() {
        var aJson = {
            onClick: this._download.bind(this, 'json'),
            href: 'data.json',

        };
        var aCsv = {
            onClick: this._download.bind(this, 'csv'),
            href: 'data.csv'
        };
        return (<div className="toolbar">
            <button onClick={this._toogleSearch}>Search</button>
            <a {...aJson}>Export JSON</a>
            <a {...aCsv}>Export CSV</a>
        </div>);
    },
    _renderSearch: function() {
        if (!this.state.search) {
            return null;
        }
        return (
            <tr onChange={this._search}>
                {
                    this.props.headers.map(function(_ignore, idx) {
                        return (<td key={idx}><input type="text" data-idx={idx}/></td>);
                    })
                }
            </tr>
        );
    },
    _renderTable: function() {
        return (
            <table>
                <thead onClick={this._sort}>
                    <tr>
                        {
                            this.props.headers.map(function(title, idx){
                                if (this.state.sortby === idx) {
                                    title += this.state.descending ? '\u2191' : '\u2193';
                                }
                                return <th key={idx}>{title}</th>;
                            }, this)
                        }
                    </tr>
                </thead>
                <tbody onDoubleClick={this._showEditor}>
                    {this._renderSearch()}
                    {
                        this.state.data.map(function(row, rowidx) {
                            return (
                                <tr key={rowidx}>
                                    {
                                        row.map(function(cell, idx) {
                                            var content = cell;
                                            var edit = this.state.edit;
                                            if (edit && rowidx === edit.row && edit.cell === idx) {
                                                content = <form onSubmit={this._save}><input type="text" defaultValue={content}/></form>;
                                            }
                                            return <td key={idx} data-row={rowidx}>{content}</td>;
                                        }, this)
                                    }
                                </tr>
                                );
                        }, this)
                    }
                </tbody>
            </table>
        );
    },
    _replay: function() {
        if (this._log.length === 0) {
            console.warn('No state to replay yet');
            return;
        }
        var idx = -1;
        var interval = setInterval(function() {
            idx++;
            if (idx === this._log.length - 1) { // The end
                clearInterval(interval);
            }
            this.setState(this._log[idx]);
        }.bind(this), 1000);
    },
    componentDidMount: function() {
        document.onkeydown = function(e) {
            if (e.altKey && e.shiftKey && e.keyCode === 82) {   // ALT+SHIFT+R (재생)
                this._replay();
            }
        }.bind(this);
    },
    render: function() {
        return (
            <div className="Excel">
            {this._renderToolbar()}
            {this._renderTable()} 
            </div>
        );
    }
});

export default Excel