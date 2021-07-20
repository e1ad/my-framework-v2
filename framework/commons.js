
export const castArray = (value) => Array.isArray(value) ? value : [value];

export const isPrimitive = (value) => isString(value) || isNumber(value);

export const isFunction = (value) => typeof (value) === 'function';

export const isString = (value) => typeof (value) === 'string';

export const isNumber = (value) => typeof (value) === 'number' && !isNaN(value);

export const isElement = (value) => value instanceof Element;

export const createEventListener = (element, event, callback) => {
    element.addEventListener(event, callback, false);

    return () => {
        element.removeEventListener(event, callback, false);
    };
};

export const forEach = (array, callback) => {
    if (Array.isArray(array) && array.length) {
        array.forEach(callback);
    }
};

export const find = (array, callback) => {
    if (Array.isArray(array) && array.length) {
        return array.find(callback);
    }
};

export const some = (array, callback) => {
    if (Array.isArray(array) && array.length) {
        return array.some(callback);
    }

    return false;
};

export const map = (array, callback) => {
    if (Array.isArray(array) && array.length) {
        return array.map(callback);
    }

    return [];
};

export const reduce = (array, callback, initialValue) => {
    if (Array.isArray(array) && array.length) {
        return array.reduce(callback, initialValue);
    }

    return initialValue;
};

export const isNil = (value) => [undefined, null, ''].includes(value);

export const clickOutside = (element, {whitelist, onClick}) => {

    const whitelistedElements = map(whitelist, (i) => isElement(i) ? i : document.querySelector(i));

    const destroyClickOutside = createEventListener(document, 'click', (event) => {
        if (!element.contains(event.target) && !whitelistedElements.some(el => event.target.isEqualNode(el))) {
            onClick();
            destroyClickOutside();
        }
    });

    return destroyClickOutside;
};

export const noop = () => null;
