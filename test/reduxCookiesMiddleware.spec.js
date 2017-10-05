// eslint-disable-next-line import/no-extraneous-dependencies
import { applyMiddleware, createStore, compose, combineReducers } from 'redux';

import reduxCookiesMiddleware from '../src';

const setAuthToken = authToken => ({
    type: 'SET_AUTH_TOKEN',
    authToken
});

const authReducer = (state = {
    authToken: null
}, action) => {
    switch (action.type) {
        case 'SET_AUTH_TOKEN':
            return {
                ...state,
                authToken: action.authToken
            };
        default:
            return state;
    }
};

const reducers = combineReducers({
    auth: authReducer
});

const getStore = (preloadedState = {}, persistentCookies, options) => {
    const store = createStore(
        reducers,
        preloadedState,
        compose(applyMiddleware(reduxCookiesMiddleware(persistentCookies, options)))
    );

    return store;
};

describe('redux-cookies-middleware', () => {
    let setCookie = null;
    let persistentCookies = {};

    beforeEach(() => {
        persistentCookies = {
            'auth.authToken': { name: 'authToken' }
        };
        setCookie = jasmine.createSpy('setCookie');
    });

    it('should set Cookie on state change.', () => {
        const store = getStore({}, persistentCookies, { setCookie });

        store.dispatch(setAuthToken('xxx'));

        const expectedCookieName = 'authToken';
        const expectedCookieValue = JSON.stringify('xxx');

        // expectations
        expect(setCookie).toHaveBeenCalled();
        expect(setCookie.calls.count()).toEqual(1);
        expect(setCookie).toHaveBeenCalledWith(
            expectedCookieName,
            expectedCookieValue
        );
    });

    it('should use default setCookie on state change.', () => {
        const store = getStore({}, persistentCookies);

        store.dispatch(setAuthToken('xxx'));
    });

    it('should delete cookie when default delete condition meet.', () => {
        const store = getStore({}, persistentCookies, { setCookie });

        store.dispatch(setAuthToken(undefined));

        const expectedCookieName = 'authToken';
        const expectedCookieValue = undefined;

        // expectations
        expect(setCookie).toHaveBeenCalled();
        expect(setCookie.calls.count()).toEqual(1);
        expect(setCookie).toHaveBeenCalledWith(
            expectedCookieName,
            expectedCookieValue,
            0
        );
    });

    it('should log error when state not found.', () => {
        const logger = jasmine.createSpy('setCookie');

        persistentCookies = {
            random: { name: 'randomName' }
        };
        const store = getStore({}, persistentCookies, { setCookie, logger });

        store.dispatch({ type: 'RANDOM_ACTION' });

        // expectations
        expect(setCookie).not.toHaveBeenCalled();
        expect(logger).toHaveBeenCalled();
    });
});
