import { getCookie as getBrowserCookie } from './cookieApi';

/**
 * safely get cookies
 * @param {Function} getCookie
 * @param {String} cookieName
 * @return {any} cookieValue
 */
const safeGetCookie = (getCookie, cookieName) => {
    try {
        return JSON.parse(getCookie(cookieName));
    } catch (_) {
        return getCookie(cookieName);
    }
};

/**
 * get State Object from Path String
 * @param {String} path
 * @param {any} valueFromCookie
 * @return {Object} new state
 */
const getStateFromPath = (path, valueFromCookie) => {
    const pathSplit = path.split('.');
    return pathSplit.reverse()
        .reduce((finalPathState, currPathKey) =>
            ({ [currPathKey]: finalPathState }), valueFromCookie);
};

/**
 * read browser cookie into state
 * @param {Object} preloaded state
 * @param {Object} paths
 * @param {Object} get Cookie implementation
 * @return {Object} new state
 */
const getStateFromCookies = (
    preloadedState = {},
    paths,
    getCookie = getBrowserCookie
) => {
    const pathStates = Object.keys(paths).map((path) => {
        const pathConfig = paths[path];
        const valueFromCookie = safeGetCookie(getCookie, pathConfig.name);
        return getStateFromPath(path, valueFromCookie);
    });
    return pathStates
        .reduce((finalState, pathState) => ({ ...finalState, ...pathState }), preloadedState);
};

export default getStateFromCookies;
