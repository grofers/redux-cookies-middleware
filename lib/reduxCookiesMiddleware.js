'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _cookieApi = require('./cookieApi');

var _cookieApi2 = _interopRequireDefault(_cookieApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Middleware to persist state in cookies.
 * @param {Object} paths
 * @param {Object} customOptions
 */
var reduxCookiesMiddleware = function reduxCookiesMiddleware() {
    var paths = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var customOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var options = _extends({
        logger: console.error,
        setCookie: _cookieApi2.default,
        defaultEqualityCheck: function defaultEqualityCheck(a, b) {
            return a === b;
        },
        defaultDeleteCheck: function defaultDeleteCheck(value) {
            return typeof value === 'undefined';
        }
    }, customOptions);

    var _getVal = function _getVal(state, path) {
        var pathPartsList = path.split('.');
        var value = state;
        var index = void 0;

        for (index = 0; index < pathPartsList.length; index += 1) {
            var pathPart = pathPartsList[index];

            if (Object.hasOwnProperty.call(value, pathPart)) {
                value = value[pathPart];
            } else {
                options.logger('state not found at store.getState().' + path);
                break;
            }
        }

        return index === pathPartsList.length ? value : null;
    };

    return function (store) {
        return function (next) {
            return function (action) {
                var prevState = store.getState();
                var result = next(action);
                var nextState = store.getState();

                Object.keys(paths).forEach(function (pathToState) {
                    var prevVal = _getVal(prevState, pathToState);
                    var nextVal = _getVal(nextState, pathToState);
                    var state = paths[pathToState];
                    var equalityCheck = state.equalityCheck || options.defaultEqualityCheck;
                    var deleteCheck = state.deleteCheck || options.defaultDeleteCheck;

                    if (!equalityCheck(prevVal, nextVal)) {
                        if (deleteCheck(nextVal)) {
                            options.setCookie(state.name, JSON.stringify(nextVal), 0);
                        } else {
                            options.setCookie(state.name, JSON.stringify(nextVal));
                        }
                    }
                });

                return result;
            };
        };
    };
};

exports.default = reduxCookiesMiddleware;
//# sourceMappingURL=reduxCookiesMiddleware.js.map