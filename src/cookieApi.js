import jsCookie from 'js-cookie';

const getCookie = name => jsCookie.get(name);

const setCookie = (name, value, expiry = 365, secure = false) => {
    jsCookie.set(name, value, { expires: expiry, path: '/', secure });
};

export { getCookie };
export default setCookie;
