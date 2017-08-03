import jsCookie from 'js-cookie';

import setCookie, { getCookie } from '../src/cookieApi';

describe('getCookie', () => {
    it('should read cookie', () => {
        jsCookie.set('key', 'val');

        expect(getCookie('key')).toEqual('val');
    });
});

describe('setCookie', () => {
    it('should set cookie', () => {
        setCookie('key2', 'val2');

        expect(jsCookie.get('key2')).toEqual('val2');
    });
});
