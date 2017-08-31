[![Build Status](https://travis-ci.org/grofers/redux-cookies-middleware.svg?branch=master)](https://travis-ci.org/grofers/redux-cookies-middleware)
[![Coverage Status](https://coveralls.io/repos/github/grofers/redux-cookies-middleware/badge.svg?branch=master)](https://coveralls.io/github/grofers/redux-cookies-middleware?branch=master)
[![Code Climate](https://codeclimate.com/github/grofers/redux-cookies-middleware/badges/gpa.svg)](https://codeclimate.com/github/grofers/redux-cookies-middleware)
[![NPM Package](https://badge.fury.io/js/redux-cookies-middleware.svg)](https://www.npmjs.org/package/redux-cookies-middleware)

# redux-cookies-middleware

redux-cookies-middleware is a Redux middleware which watches for changes in Redux state &amp; stores them in browser cookie.

## Installation

```yarn add redux-cookies-middleware```

or

```npm i redux-cookies-middleware --save```

## Usage

```js
import { applyMiddleware, createStore, compose } from 'redux';

import reduxCookiesMiddleware from 'redux-cookies-middleware';
import getStateFromCookies from 'redux-cookies-middleware/getStateFromCookies';

// initial state
let initialState = {
  auth: {
    token: 'xxxx',
    key: 'xxx'
  },
  session: 'xxx-xxx'
};

// state to persist in cookies
const paths = {
  'auth.token': { name: 'my_app_token' },
  'session': { name: 'my_app_session' }
};

// read stored data in cookies and merge it with the initial state
initialState = getStateFromCookies(initialState, paths);

// create store with data stored in cookies merged with the initial state
const store = createStore(
  reducer, 
  initialState, 
  applyMiddleware([
    reduxCookiesMiddleware(paths)
  ])
);
```

### `reduxCookiesMiddleware(paths[, options])`

#### `paths`

An object of parts of subsets to sync. Use dot-notation to specify the path of 
the subsets of the store that has to be synced with cookies. Consider a store
with the following shape as an example:

```js
{
  auth: {
    token: 'xxxx',
    key: 'xxx'
  },
  session: 'xxx-xxx',
  username: 'xxxxxxx'
}

```

To sync the auth `token` and `session` with cookies, pass the following `paths` object to the middleware:

```js
{
  session: {
    name: 'session'  // name of the cookie in which the value of session will be synced
  },
  'auth.token': {
    name: 'auth_token'  // name of the cookie in which the value of auth.token will be synced
  }
}
```

Value of the path object is another object that takes more configuration options:

| Property | Required | Type | Default | Description |
|----------|----------|------|---------|-------------|
| name | Yes | String | | Name of the cookie in which the part of the store should be synced. |
| equalityCheck | No | Function | `options.defaultEqualityCheck` | A function to verify if the value before an action is dispatched and after the action is dispatched is equal or not. If the values are equal, the part of the store is not synced with the cookie. This is just to avoid setting cookies again and again if the value of that part of the store has not changed. You can set a custom equality check for every part of the store you want to sync with the cookies. Default value for this property is the value set for `options.defaultEqualityCheck`. |
| deleteCheck | No | Function  | `options.defaultDeleteCheck` | A function to verify if the cookie should be deleted. Default value for this property is the value set for `options.defaultDeleteCheck`. |

###### Example

```js
import isEqual from 'lodash.isequal';

// initial state
let initialState = {
  auth: {
    token: 'xxxx',
    key: 'xxx'
  },
  session: 'xxx-xxx'
};

const paths = {
  session: {
    name: 'session'
  },
  'auth.token': {
    name: 'auth_token',
    equalityCheck: isEqual
  }
};

// read stored cookies into store
initialState = getStateFromCookies(initialState, persistCookies);

const store = createStore(
  reducer, 
  initialState, 
  applyMiddleware([
    reduxCookiesMiddleware(paths)
  ])
);

```

#### `options`

An object of common options for the middleware.

`options` object has the following properties:

| Property | Required | Type | Default |
|----------|----------|------|---------|
| logger | No | Function | `console.error` |
| setCookie | No | Function | A function that creates the cookie. |
| defaultEqualityCheck | No | Function | A function that does shallow equality check. |
| defaultDeleteCheck | No | Function | A function that performs undefined check. |

Description of each property:
* `logger(msg)`: This function can be used to capture errors occured inside `redux-cookies-middleware`. A good use-case for this could be to capture these errors and log them to Sentry or Errorception.
  * This function has the following parameters:
    * `msg`: Message you want to log with the help of this function.
* `setCookie(name, value, [, expiry, secure])`: A function that creates the cookie. Provide a custom cookie setting implementation. Use-cases of this are implementation of cookie versioning or using the common cookie setting logic in your application. You will have to use a custom implementation of [`getCookie`]() as well.
  * This function has the following parameters:
    * `name`: Name of the cookie.
    * `value`: Value of the cookie.
    * `expiry` (optional): Expiry time (in days) of the cookie. Default: 365 days.
    * `secure` (optional): Either true or false, indicating if the cookie transmission requires a secure protocol (https). Default: false.
* `defaultEqualityCheck(oldVal, newVal)`: A function to verify if the value before an action is dispatched and after the action is dispatched is equal or not. If the values are equal, the part of the store is not synced with the cookie. This is just to avoid setting cookies again and again if the value of that part of the store has not changed. You can set a custom equality check for every part of the store you want to sync with the cookies. Default value for this property is a function which does shallow comparison of two values using the `===` operator.
  * This function has the following parameters:
    * `oldVal`: Value of the part of the store before the reducers for a particular action execute.
    * `newVal`: Value of the part of the store after the reducers for a particular action execute.
  * Returns: `Boolean` - `true` if `oldVal` and `newVal` are equal.
* `defaultDeleteCheck(oldVal, newVal)`: A function to verify if the cookie should be deleted. The default value for this property is a function that checks if the value is `undefined`.
  * This function has the following parameters:
    * `oldVal`: Value of the part of the store before the reducers for a particular action execute.
    * `newVal`: Value of the part of the store after the reducers for a particular action execute.
  * Returns: `Boolean` - `true` if the cookie should be deleted.

###### Example

```js
import Raven from 'raven';

const paths = { ... };

const setCookie = (name, value) => {
  // Add your custom implementation for setting cookie
};

const logger = msg => {
  // Log to Sentry
  Raven.captureException(msg);
};

const defaultEqualityCheck = lodash.isEqual;
const defaultDeleteCheck = val => val === null;

const customOptions = {
  logger,
  setCookie,
  defaultEqualityCheck,
  defaultDeleteCheck,
};

reduxCookiesMiddleware(paths, customOptions);
```

### `getStateFromCookies(initialState, paths[, getCookie])`

`getStateFromCookies` can be used to hydrate the store with the data synced with the cookies. It basically takes `initialState`, reads the synced state from cookies and merges it with the initial state of your application.

It returns the `initialState` merged with the state synced with cookies.

#### `initialState`

`initialState` is the initial state object of your application.

#### `paths`

`paths` is the configuration of paths to sync with cookies as used with [`reduxCookiesMiddleware`](#paths).

#### `getCookie(name)`

`getCookie()` is a function that reads a cookie. Provide a custom cookie reading implementation. Use-cases of this are implementation of cookie versioning or using the common cookie setting logic in your application. You would want to use it if you are using a custom implementation of `setCookie`.
  * This fucntion has the following parameters:
    * `name`: Name of the cookie to read
  * Returns: expected value of the part of the store synced with the cookie.

## Server-Side Rendering Example

While using `redux-cookies-middleware` with server-side rendering, we will have to override the default implementation of `getCookie` and `setCookie` functions to be able to read from cookie headers and send appropriate `Set-Cookie` headers to the browser.

Consider this detailed example:

```js
import express from 'express';
import cookieParser from 'cookie-parser';
import { applyMiddleware, createStore, compose } from 'redux';

import reduxCookiesMiddleware from 'redux-cookies-middleware';
import getStateFromCookies from 'redux-cookies-middleware/getStateFromCookies';

// state to persist in cookies
const paths = {
  'auth.token': { name: 'my_app_token' },
  'session': { name: 'my_app_session' }
};

// reads a cookie from the express request object.
const getCookieOnServer = (req, name) => req.cookies[name];

// sets cookie using the express response object.
const setCookieOnServer = (res, name, value) => {
  res.cookie(name, value);
};

const app = express();
app.use(cookieParser());  // required to parse cookie headers into a Javascript object

app.get('/', (req, res) => {
  // initial state
  let initialState = {
    auth: {
      token: 'xxxx',
      key: 'xxx'
    },
    session: 'xxx-xxx'
  };

  // read stored data in cookies and merge it with the initial state
  initialState = getStateFromCookies(initialState, paths, (name, value) => getCookieOnServer(req, name));

  // create store with data stored in cookies merged with the initial state
  const store = createStore(
    reducer, 
    initialState, 
    applyMiddleware([
      reduxCookiesMiddleware(
        paths,
        {
          setCookie: (name, value) => setCookieOnServer(res, name, value)
        }
      )
    ])
  );
  
  res.send('Hello world!');
});
```

## How to Contribute

1. ```yarn``` or ```npm install``` to install npm development dependencies.
2. ```yarn build``` or ```npm run build``` will compile the source into dist.
3. ```yarn test``` or  ```npm run test``` will run the unit test suit.
4. ```yarn lint``` or  ```npm run lint``` will run eslint linting check.

## License

[MIT](LICENSE)
