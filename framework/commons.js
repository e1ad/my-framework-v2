export const castArray = (value) => Array.isArray(value) ? value : [value];

export const isPrimitive = (value) => isString(value) || isNumber(value) || isBoolean(value);

export const isFunction = (value) => typeof (value) === 'function';

export const isString = (value) => typeof (value) === 'string';

export const isBoolean = (value) => typeof (value) === 'boolean';

export const isNumber = (value) => typeof (value) === 'number' && !isNaN(value);

export const isElement = (value) => value instanceof Element;

export const isPlainObject = (value) => value && typeof (value) === 'object' && !Array.isArray(value);

export const isNil = (value) => [undefined, null, ''].includes(value);

export const selectElement = (element) => isElement(element) ? element : document.querySelector(element);

export const createEventListener = (element, event, callback, options = false) => {
    element.addEventListener(event, callback, options);

    return () => {
        element.removeEventListener(event, callback, options);
    };
};

export const forEach = (object, callback) => {
    if (object && typeof object === 'object') {
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                callback(object[key], key);
            }
        }
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

export const clickOutside = (element, {whitelist, onClick}) => {

    const whitelistedElements = map(whitelist, selectElement);

    const destroyClickOutside = createEventListener(document, 'click', (event) => {
        if (!element.contains(event.target) && !whitelistedElements.some((el) => event.target.isEqualNode(el))) {
            onClick();
            destroyClickOutside();
        }
    });

    return destroyClickOutside;
};

export const noop = () => null;
