'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _cookieApi = require('./cookieApi');

/**
 * return the node referenced by path in state.
 * @param {Object} path
 * @return {Object} node reference
 **/
function pathSlicer(path) {
    var getSubtree = function getSubtree(subtree, key) {
        if (key.indexOf('.') > -1) {
            var remaining = key.split('.').slice(1).join('.');

            return getSubtree(subtree[key.split('.')[0]], remaining);
        }
        return subtree[key];
    };

    return function (state) {
        return getSubtree(state, path);
    };
}

/**
 * read browser cookie into state
 * @param {Object} preloaded state
 * @param {Object} paths
 * @param {Object} get Cookie implementation
 * @return {Object} new state
 **/
var getStateFromCookies = function getStateFromCookies(preloadedState, paths) {
    var getCookie = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _cookieApi.getCookie;

    Object.keys(paths).forEach(function (pathToState) {
        var pathConf = paths[pathToState];
        var pathSplit = pathToState.split('.');
        var terminalKey = pathSplit.slice(-1);

        // read cookies
        var storedState = getCookie(pathConf.name);

        // get a slice of state path where to put cookie value
        var stateTree = pathSplit.length > 1 ? pathSlicer(pathSplit.slice(0, -1).join('.'))(preloadedState) : preloadedState;

        if (storedState) {
            try {
                stateTree[terminalKey] = JSON.parse(storedState);
            } catch (err) {
                console.error('Unable to set state from cookie at ' + pathConf.name + '. Error: ', err);
            }
        }
    });

    return preloadedState;
};

exports.default = getStateFromCookies;
//# sourceMappingURL=getStateFromCookies.js.map