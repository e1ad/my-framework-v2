import {castArray, forEach, isElement, isFunction, isPlainObject, isPrimitive, isString, reduce} from './commons.js';

export const createElement = (tag, attributes = {}, children) => {
    const element = document.createElement(tag);
    const fragment = document.createDocumentFragment();

    const _attributes = getAttributes(attributes);

    forEach(_attributes, (item, key) => {
        const value = Array.isArray(item) ? item.join(' ') : item;
        switch (key) {
            case 'className':
                element.setAttribute('class', value);
                break
            default:
                element.setAttribute(key, value);
                break
        }
    });

    forEach(castArray(children), (child) => {
        appendChild(child, fragment);
    });

    element.appendChild(fragment);

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

export const el = (tag, attr) => {
    return (children) => {
        const args = isPlainObject(children) && !isElement(children) ? children : { children };
        return creatDomElements({tag, attr, ...args});
    };
};

const getAttributes = (attributes) => {
    if (isString(attributes)) {
        return reduce(attributes.split(','), (acc, item) => {
            const [key, value] = item.split('=');
            const trimKey = key.trim();
            const trimValue = value.trim();

            acc[trimKey] = acc[trimKey] ? `${acc[trimKey]}  ${trimValue}` : trimValue;

            return acc;
        }, {});
    }

    return attributes
};

let counter = 0;

export const style = (tag, style) => {
    const head = document.querySelector('head');
    const uniqId = `style_${counter = counter + 1}`;
    const styleText = (isFunction(style) ? style() : style).replaceAll(':host', `.${uniqId}`);

    head.append(createElement('style', null, styleText));

    return ({ attr = {}, ...args}) => {
        if (isFunction(tag)){
            return tag({...args, className: uniqId});
        }

        const className = Array.isArray(attr.className) ? [...attr.className, uniqId] : uniqId;

        return creatDomElements({
            tag,
            attr: isString(attr) ? `${attr}, className=${uniqId}` : {...attr, className},
            ...args
        });
    };
};

export const styleElement = (element, style) => {
    forEach(style, (value, key)=>{
        element.style[key] = value;
    });
   
    return element;
};

export const creatDomElements = (item) => {
    if(!item){
        return;
    }

    const children = Array.isArray(item.children) ? item.children.map(creatDomElements) : item.children;

    const element = isElement(item) ? item : createElement(item.tag, item.attr, children);

    if (item.style) {
        styleElement(element, item.style);
    }

    if (isFunction(item.onClick)) {
        item.event = { name: 'click', callback: item.onClick };
    }

    if (item.event) {
        element.addEventListener(item.event.name, item.event.callback, false);
    }

    item.ref?.(element);

    return element;
};
