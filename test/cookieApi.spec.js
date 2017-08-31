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

    it('should set cookie with expiry', () => {
        spyOn(jsCookie, 'set');
        setCookie('key', 'val', 7);

        expect(jsCookie.set).toHaveBeenCalledWith('key', 'val', { expires: 7, path: '/', secure: false });
    });

    it('should set secure', () => {
        spyOn(jsCookie, 'set');
        setCookie('key', 'val', 7, true);

        expect(jsCookie.set).toHaveBeenCalledWith('key', 'val', { expires: 7, path: '/', secure: true });
    });
});
