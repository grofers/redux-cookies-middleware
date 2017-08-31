'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getCookie = undefined;

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getCookie = function getCookie(name) {
    return _jsCookie2.default.get(name);
};

var setCookie = function setCookie(name, value) {
    var expiry = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 365;
    var secure = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _jsCookie2.default.set(name, value, { expires: expiry, path: '/', secure: secure });
};

exports.getCookie = getCookie;
exports.default = setCookie;
//# sourceMappingURL=cookieApi.js.map