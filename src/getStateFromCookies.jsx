import { getCookieByName } from './cookiesApi';

/**
 * return the node referenced by paths in state.
 * @param {Object} paths
 * @return {Object} node reference
 **/
function pathSlicer(paths) {
    const getSubtree = (subtree, key) => {
        if (key.indexOf('.') > -1) {
            const remaining = key.split('.').slice(1).join('.');

            return getSubtree(subtree[key.split('.')[0]], remaining);
        }
        return subtree[key];
    };

    return (state) => getSubtree(state, paths);
}

/**
 * read browser cookie into state
 * @param {Object} preloaded state
 * @param {Object} persistCookies
 * @param {Object} get Cookie implementation
 * @return {Object} new state
 **/
const getStateFromCookies = (
    preloadedState,
    persistCookies,
    getCookie = getCookieByName
) => {
    Object.keys(persistCookies).forEach(pathToState => {
        const persistCookie = persistCookies[pathToState];

        // read cookies
        const storedState = getCookie(persistCookie.name);

        // get a slice of state path where to put cookie value
        const stateTree = pathSlicer(pathToState)(preloadedState);

        if (storedState) {
            try {
                Object.assign(stateTree, JSON.parse(storedState));
            } catch (err) {
                console.error(`error while parsing cookie ${persistCookie.name}.`);
            }
        }
    });

    return preloadedState;
};

export default getStateFromCookies;
