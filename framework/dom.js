import {castArray, forEach, isElement, isFunction, isPlainObject, isPrimitive, isString, reduce} from './commons.js';

export const createElement = (tag, attributes = {}, children) => {
    const element = document.createElement(tag);
    const fragment = document.createDocumentFragment();

    const _attributes = getAttributes(attributes);

    forEach(_attributes, (value, key) => {
        element.setAttribute(key, value);
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
    return (data) => {
        const args = isPlainObject(data) && !isElement(data) ? data : {children: data};
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

export const style = (tag, _style) => {

    const head = document.querySelector('head');
    const className = `className_${Math.floor(Math.random() * 1000) + 1}`;
    const styleText = (isFunction(_style) ? _style() : _style).replaceAll(':host', `.${className}`);

    head.append(createElement('style', null, styleText));

    return ({children, attr = {}, ref, event, onClick, style}) => {
        const fullClassName = `${className} ${attr.class || ''}`;

        return creatDomElements({
            tag,
            attr: isString(attr) ? `${attr}, class=${fullClassName}` : {...attr, class: fullClassName},
            ref,
            event,
            onClick,
            style,
            children
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
    const children = Array.isArray(item.children) ? item.children.map(creatDomElements) : item.children;

    const element = isElement(item) ? item : createElement(item.tag, item.attr, children);

    if (item.style) {
        styleElement(element, item.style);
    }

    if (isFunction(item.onClick)) {
        item.event = {name: 'click', callback: item.onClick};
    }

    if (item.event) {
        element.addEventListener(item.event.name, item.event.callback, false);
    }

    if (isFunction(item.ref)) {
        item.ref(element);
    }

    return element;
};

export const component = (_component, args = {}) => {
    return (props) => {
        return creatDomElements({
            tag: 'div',
            ...args,
            ref: el => {
                const componentInstance = _component(el, {props});
                args.ref && args.ref(componentInstance);
            },
        });
    }
}
