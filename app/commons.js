export const createElement = (tag, attributes = {}, children) => {
    const element = document.createElement(tag);

    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }

    forEach(
        castArray(children),
        child => appendChild(child, element)
    );

    return element;
};

export const creatDomElements = (item) => {
    const children = Array.isArray(item.children) ? item.children.map(creatDomElements) : item.children;

    const element = isElement(item) ? item : createElement(item.tag, item.attr, children);

    if (item.style) {
        styleElement(item, item.style);
    }

    if (item.event) {
        element.addEventListener(item.event.name, item.event.callback, false);
    }

    return element;
};

const appendChild = (child, element) => {
    if (isElement(child)) {
        element.appendChild(child);
    } else if (isPrimitive(child)) {
        const text = document.createTextNode(child);
        element.appendChild(text);
    }
};

export const style = (tag, style) => {

    const head = document.querySelector('head');
    const className = `className_${Math.floor(Math.random() * 1000) + 1}`;
    const styleText = (isFunction(style) ? style() : style).replaceAll(':host', `.${className}`);

    head.append(createElement('style', null, styleText));

    return ({children, attr = {}, event}) => {
        return creatDomElements({
            tag,
            attr: {...attr, class: `${className} ${attr.class || ''}`},
            event,
            children
        });
    };
};

export const styleElement = (element, style) => {
    for (let key in style) {
        if (style.hasOwnProperty(key)) {
            element.style[key] = style[key];
        }
    }

    return element;
};

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

export const map = (array, callback) => {
    if (Array.isArray(array) && array.length) {
        return array.map(callback);
    }
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
        if (!element.contains(event.target) && !whitelistedElements.includes(event.target)) {
            onClick();
            destroyClickOutside();
        }
    });

    return destroyClickOutside;
};
