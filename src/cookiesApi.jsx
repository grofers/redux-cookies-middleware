import cookie from 'cookie';

const getCookieByName = (cookieName, cookieString = document.cookie) => (
    cookie.parse(cookieString)[cookieName]
);

const setCookie = (cookieName, cookieValue, expiryEpoch = (365 * 24 * 60 * 60 * 1000)) => {
    const expiryDate = new Date(expiryEpoch);
    const cookieString = [
        `${cookieName}=${cookieValue}`,
        `expires=${expiryDate.toUTCString()}`,
        'path=/'
    ].join(';');

    document.cookie = cookieString;
};

export { getCookieByName };
export default setCookie;
