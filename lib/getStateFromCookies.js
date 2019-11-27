'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _cookieApi = require('./cookieApi');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * safely get cookies
 * @param {Function} getCookie
 * @param {String} cookieName
 * @return {any} cookieValue
 */
var safeGetCookie = function safeGetCookie(getCookie, cookieName) {
    try {
        return JSON.parse(getCookie(cookieName));
    } catch (_) {
        return getCookie(cookieName);
    }
};

/**
 * get State Object from Path String
 * @param {String} path
 * @param {any} valueFromCookie
 * @return {Object} new state
 */
var getStateFromPath = function getStateFromPath(path, valueFromCookie) {
    var pathSplit = path.split('.');
    return pathSplit.reverse().reduce(function (finalPathState, currPathKey) {
        return _defineProperty({}, currPathKey, finalPathState);
    }, valueFromCookie);
};

/**
 * read browser cookie into state
 * @param {Object} preloaded state
 * @param {Object} paths
 * @param {Object} get Cookie implementation
 * @return {Object} new state
 */
var getStateFromCookies = function getStateFromCookies() {
    var preloadedState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var paths = arguments[1];
    var getCookie = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _cookieApi.getCookie;

    var pathStates = Object.keys(paths).map(function (path) {
        var pathConfig = paths[path];
        var valueFromCookie = safeGetCookie(getCookie, pathConfig.name);
        return getStateFromPath(path, valueFromCookie);
    });
    return pathStates.reduce(function (finalState, pathState) {
        return (0, _merge2.default)({}, finalState, pathState);
    }, preloadedState);
};

exports.default = getStateFromCookies;
//# sourceMappingURL=getStateFromCookies.js.map