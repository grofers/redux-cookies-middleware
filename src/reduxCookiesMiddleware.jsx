import setCookie from './cookiesApi';

/**
 * Middleware to persist state in cookies.
 * @param {Object} statesToPersist
 * @param {Object} customOptions
 */
const reduxCookiesMiddleware = (statesToPersist = {}, customOptions = {}) => {
    const options = {
        logger: console.error,
        setCookie,
        defaultEqualityCheck: (a, b) => (a === b),
        defaultDeleteCheck: (value) => (typeof value === 'undefined'),
        ...customOptions
    };

    const _getVal = (state, path) => {
        const pathPartsList = path.split('.');
        let value = state;
        let index;

        for (index = 0; index < pathPartsList.length; index++) {
            const pathPart = pathPartsList[index];

            if (Object.hasOwnProperty.call(value, pathPart)) {
                value = value[pathPart];
            } else {
                options.logger(`state not found at store.getState().${path}`);
                break;
            }
        }

        return (index === pathPartsList.length) ? value : null;
    };

    return store => next => action => {
        const prevState = store.getState();
        const result = next(action);
        const nextState = store.getState();

        Object.keys(statesToPersist).forEach(pathToState => {
            const prevVal = _getVal(prevState, pathToState);
            const nextVal = _getVal(nextState, pathToState);
            const state = statesToPersist[pathToState];
            const equalityCheck = state.equalityCheck || options.defaultEqualityCheck;
            const deleteCheck = state.deleteCheck || options.defaultDeleteCheck;

            if (!equalityCheck(prevVal, nextVal)) {
                if (deleteCheck(nextVal)) {
                    options.setCookie(state.name, JSON.stringify(nextVal), 0);
                } else {
                    options.setCookie(state.name, JSON.stringify(nextVal));
                }
            }
        });

        return result;
    };
};

export default reduxCookiesMiddleware;
