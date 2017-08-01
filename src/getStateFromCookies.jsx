import { getCookie as getBrowserCookie } from './cookieApi';

/**
 * return the node referenced by path in state.
 * @param {Object} path
 * @return {Object} node reference
 **/
function pathSlicer(path) {
    const getSubtree = (subtree, key) => {
        if (subtree && key.indexOf('.') > -1) {
            const remaining = key.split('.').slice(1).join('.');

            return getSubtree(subtree[key.split('.')[0]], remaining);
        }
        return subtree[key];
    };

    return (state) => getSubtree(state, path);
}

/**
 * read browser cookie into state
 * @param {Object} preloaded state
 * @param {Object} paths
 * @param {Object} get Cookie implementation
 * @return {Object} new state
 **/
const getStateFromCookies = (
    preloadedState,
    paths,
    getCookie = getBrowserCookie
) => {
    Object.keys(paths).forEach(pathToState => {
        const pathConf = paths[pathToState];

        // read cookies
        const storedState = getCookie(pathConf.name);

        // get a slice of state path where to put cookie value
        const stateTree = pathSlicer(pathToState)(preloadedState);

        if (storedState) {
            try {
                Object.assign(stateTree, JSON.parse(storedState));
            } catch (err) {
                console.error(`Error while parsing cookie ${pathConf.name}.`);
            }
        }
    });

    return preloadedState;
};

export default getStateFromCookies;
