import jsCookie from 'js-cookie';

const getCookieByName = name => jsCookie.get(name);

const setCookie = (name, value, expiry = 365) => {
    jsCookie.set(name, value, { expires: expiry, path: '/' });
};

export { getCookieByName };
export default setCookie;
