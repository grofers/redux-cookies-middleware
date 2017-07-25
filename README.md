# redux-cookies-middleware

Redux middleware to syncs a subset of Redux store to Browser cookies.


## How to install

```yarn add redux-cookies-middleware``` or

```npm i redux-cookies-middleware --save```


## How to use

```
import { applyMiddleware, createStore, compose } from 'redux';

import reduxCookiesMiddleware from 'redux-cookies-middleware';
import getStateWithCookies from 'redux-cookies-middleware/getStateWithCookies';

// state to persist in cookies map
const persistCookies = {
    'data.token': { name: 'my_app_token' },
    'session': { name: 'my_app_session' }
};

// initial state
let preloadedState = {
    auth: {
        token: 'xxxx',
        key: 'xxx'
    },
    session: 'xxx-xxx'
};

// read stored cookies into store
preloadedState = getStateWithCookies(preloadedState, persistCookies);

const store = createStore(
    reducer, 
    preloadedState, 
    applyMiddleware([
        reduxCookiesMiddleware(persistCookies)
    ])
);
```


## reduxCookiesMiddleware(persistCookies, customOptions)

```
const persistCookies = {
    <path_to_state_in_store>: {
        name: <cookie_name>,
        equalityCheck,
        deleteCheck
    }
};

const customOptions = {
    logger,
    setCookie,
    defaultEqualityCheck,
    defaultDeleteCheck,
};

reduxCookiesMiddleware(persistCookies, customOptions);
```


## getStateWithCookies(preloadedState, persistCookies, [getCookie])

#### preloadedState
* initial store state

#### getCookie
* @type function(cookieName, [cookieString])
* cookieString default value is ```document.cookie```.


## persistCookies option

#### path_to_state_in_store
* is dot seprated state accessor eg. ```'data.ui.cart', 'data.auth.accessToken', 'data.cart' ...```

#### name
* @isMandatory
* @type String
* redux-cookies-middleware use this name as cookie name.

#### equalityCheck
* @type function(oldVal, newVal)
* @return boolean true|false
* redux-cookies-middleware use this to know equality condition else it will use defaultEqualityCheck.

#### deleteCheck
* @type function(value)
* @return boolean true|false
* redux-cookies-middleware use this to know delete condition else it will use defaultDeleteCheck.


## custom options

#### logger
* @type function(message)
* @default console.error
* redux-cookies-middleware use this to tell error eg. 'state not found at store.getState().auth.accessToken'
* you can use this function to capture errors occured inside redux-cookies-middleware & log then to sentry or any custom database.

#### setCookie
* @type function(cookieName, cookieValue, expiryEpoch)
* @typeof cookieName String
* @typeof cookieValue String
* @typeof expiryEpoch Number
* @default value of expiryEpoch is 365 * 24 * 60 * 60 * 1000 i.e. an year.
* provide custom setCookie implementation when you want to control the versoning of cookies or having some custom set cookie implementation logic.
* redux-cookies-middleware will call setCookie with 2 arguments to set a cookie. eg. ```setCookie('cookie_name', 'cookie_value')``` and will call with 3 arguments to delete cookie eg. ```setCookie('cookie_name', 'cookie_value', 0)```

#### defaultEqualityCheck
* @type function(oldVal, newVal)
* @return boolean true|false
* @default shallow comparision b/w oldVal & newVal.
* redux-cookies-middleware use this to determine whether oldVal & newVal are equal you can use lodash.isEqual for deep comparison or you can write one of your own.

#### defaultDeleteCheck
* @type function(value)
* @return boolean true|false
* @default value should not be undefined
* redux-cookies-middleware use this to determine when to delete some cookie.


## How to Contribute

1. ```yarn``` or ```npm install``` to install npm development dependencies.
2. ```npm run build``` will compile source into dist.
3. ```npm run test``` will run the unit test suit.
4. ```npm run lint``` will run eslint linting check.


## License

[MIT](LICENSE)
