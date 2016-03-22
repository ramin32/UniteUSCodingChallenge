var jsdom = require('jsdom');

var doc = jsdom.jsdom('<!doctype html><html><body></body></html>');

var win = doc.defaultView;

global.document = doc;
global.window = win;

global.window.localStorage = {
    _data       : {},
    setItem     : function(id, val) { return this._data[id] = String(val); },
    getItem     : function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : undefined; },
    removeItem  : function(id) { return delete this._data[id]; },
    clear       : function() { return this._data = {}; }
};

propagateToGlobal(win);

function propagateToGlobal (window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue;
    if (key in global) continue;

    global[key] = window[key];
  }
}

global.jQuery = global.$ = require('jquery');
require('../lib/bootstrap.min.js');
global.toastr = require('../lib/toastr.min.js');

