import { getCookie as getBrowserCookie } from './cookieApi';

/**
 * return the node referenced by path in state.
 * @param {Object} path
 * @return {Object} node reference
 */
function pathSlicer(path) {
    const getSubtree = (subtree, key) => {
        if (key.indexOf('.') > -1) {
            const remaining = key.split('.').slice(1).join('.');

            return getSubtree(subtree[key.split('.')[0]], remaining);
        }
        return subtree[key];
    };

    return state => getSubtree(state, path);
}

/**
 * read browser cookie into state
 * @param {Object} preloaded state
 * @param {Object} paths
 * @param {Object} get Cookie implementation
 * @return {Object} new state
 */
const getStateFromCookies = (
    preloadedState,
    paths,
    getCookie = getBrowserCookie
) => {
    Object.keys(paths).forEach((pathToState) => {
        const pathConf = paths[pathToState];
        const pathSplit = pathToState.split('.');
        const terminalKey = pathSplit.slice(-1);

        // read cookies
        const storedState = getCookie(pathConf.name);

        // get a slice of state path where to put cookie value
        const stateTree = pathSplit.length > 1 ? (
            pathSlicer(pathSplit.slice(0, -1).join('.'))(preloadedState)
        ) : preloadedState;

        if (storedState) {
            try {
                stateTree[terminalKey] = JSON.parse(storedState);
            } catch (err) {
                console.error(`Unable to set state from cookie at ${pathConf.name}. Error: `, err);
            }
        }
    });

    return preloadedState;
};

export default getStateFromCookies;
