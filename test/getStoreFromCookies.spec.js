import jsCookie from 'js-cookie';

import { getStateFromCookies } from '../src';

describe('getStateFromCookies', () => {
    const userId = 1;
    const authToken = 'xxxxx';
    const geolocation = {
        lat: 12.34,
        lon: 56.78
    };
    const checkout = {
        paymentOptions: {
            netbanking: true,
            wallets: true,
            cod: false
        }
    };

    let initialState;

    beforeEach(() => {
        initialState = {
            userId: null,
            auth: {
                authToken: null
            },
            geolocation: {},
            ui: {
                checkout: {}
            }
        };

        jsCookie.set('userId', JSON.stringify(userId));
        jsCookie.set('authToken', JSON.stringify(authToken));
        jsCookie.set('geolocation', JSON.stringify(geolocation));
        jsCookie.set('checkout', JSON.stringify(checkout));
    });

    it('should read cookie at the path', () => {
        const paths = {
            userId: { name: 'userId' },
            geolocation: { name: 'geolocation' },
            'auth.authToken': { name: 'authToken' },
            'ui.checkout': { name: 'checkout' }
        };

        const value = getStateFromCookies(initialState, paths);

        // expectations
        expect(value.userId).toEqual(userId);
        expect(value.auth.authToken).toEqual(authToken);
        expect(value.geolocation).toEqual(geolocation);
        expect(value.ui.checkout).toEqual(checkout);
    });

    it('should work even if initial state is empty', () => {
        initialState = {};
        const paths = {
            userId: { name: 'userId' },
            geolocation: { name: 'geolocation' },
            'auth.authToken': { name: 'authToken' },
            'ui.checkout': { name: 'checkout' }
        };

        const value = getStateFromCookies(initialState, paths);

        // expectations
        expect(value.userId).toEqual(userId);
        expect(value.auth.authToken).toEqual(authToken);
        expect(value.geolocation).toEqual(geolocation);
        expect(value.ui.checkout).toEqual(checkout);
    });

    it('should work even if initial state is null', () => {
        initialState = null;
        const paths = {
            userId: { name: 'userId' },
            geolocation: { name: 'geolocation' },
            'auth.authToken': { name: 'authToken' },
            'ui.checkout': { name: 'checkout' }
        };

        const value = getStateFromCookies(initialState, paths);

        // expectations
        expect(value.userId).toEqual(userId);
        expect(value.auth.authToken).toEqual(authToken);
        expect(value.geolocation).toEqual(geolocation);
        expect(value.ui.checkout).toEqual(checkout);
    });

    it('should use custom cookie getter when passed', () => {
        const paths = {
            userId: { name: 'userId' }
        };
        const getCookie = jasmine.createSpy('getCookie');
        getStateFromCookies(initialState, paths, getCookie);

        expect(getCookie).toHaveBeenCalledWith('userId');
    });

    it('should read non JSON values from cookie', () => {
        jsCookie.set('authToken', authToken);
        jsCookie.set('userId', userId);
        jsCookie.set('geolocation', null);
        const paths = {
            userId: { name: 'userId' },
            geolocation: { name: 'geolocation' },
            'auth.authToken': { name: 'authToken' },
        };
        initialState = {
            userId: null,
            auth: {
                authToken: null
            },
            geolocation: null
        };
        const value = getStateFromCookies(initialState, paths);
        expect(value.auth.authToken).toEqual(authToken);
        expect(value.userId).toEqual(userId);
        expect(value.geolocation).toEqual(null);
    });
});
