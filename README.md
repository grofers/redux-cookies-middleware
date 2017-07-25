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

#### [preloadedState](http://redux.js.org/docs/recipes/reducers/InitializingState.html#initializing-state)
* initial Redux store state.

#### getCookie(cookieName, [cookieString])
* return cookie value.
* by Default, cookieString is ```document.cookie```.


## persistCookies option

```
const persistCookies = {
    <path_to_state_in_store>: {
        name: <cookie_name>,
        equalityCheck,
        deleteCheck
    }
};
```

#### path_to_state_in_store
* is dot seprated state accessor eg. ```'data.foo.bar'```, ```'data.foo'```.

#### name
* redux-cookies-middleware use this as cookie name.
* @isMandatory
* @type String

#### equalityCheck(oldVal, newVal)
* @return boolean true|false
* to verify does oldVal & newVal are equal or not.
* if not specified then defaultEqualityCheck will be used which does an shallow comparison of values.

#### deleteCheck(value)
* @return boolean true|false
* for what value redux-cookies-middleware should delete the cookie.
* if not specified then defaultDeleteCheck will be used which check for ```typeof value === 'undefined'```.


## custom options

#### logger(message)
* default logger is ```console.error```.
* redux-cookies-middleware use this to report error like 'state not found at store.getState().foo.bar'.
* use this function to capture error occured inside redux-cookies-middleware.

#### setCookie(cookieName, cookieValue, [expiryEpoch])
* when state changed setCookie is called, use this function to provide custom implementation for setCookie as per your application.
* ```setCookie('cookie_name', 'cookie_value')``` called like this to set a cookie.
* ```setCookie('cookie_name', 'cookie_value', 0)``` called like this to delete a cookie.
* cookieName & cookieValue is of type String.
* expiryEpoch is of type Number with default value ```365 * 24 * 60 * 60 * 1000 = 31,536,000,000``` i.e. an year.
```
const setCookie = (cookieName, cookieValue, expiryEpoch = (365 * 24 * 60 * 60 * 1000)) => {
    const expiryDate = new Date(expiryEpoch);
    const cookieString = [
        `${cookieName}=${cookieValue}`,
        `expires=${expiryDate.toUTCString()}`,
        'path=/'
    ].join(';');

    document.cookie = cookieString;
};
```

#### defaultEqualityCheck(oldVal, newVal)
* to verify does oldVal & newVal are equal or not.
* @return boolean true|false
* @default shallow comparision b/w oldVal & newVal i.e. ```oldVal === newVal```.
* you can use ```lodash.isEqual``` for deep comparison of values or you can write one of your own.

#### defaultDeleteCheck(value)
* to know when to delete some cookie.
* @return boolean true|false
* @default value condition is ```typeof value === 'undefined'```.


## How to Contribute

1. ```yarn``` or ```npm install``` to install npm development dependencies.
2. ```npm run build``` will compile source into dist.
3. ```npm run test``` will run the unit test suit.
4. ```npm run lint``` will run eslint linting check.


## License

[MIT](LICENSE)
