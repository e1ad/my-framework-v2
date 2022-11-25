import {castArray, createEventListener, forEach, isElement, isFunction, some} from './commons.js';

function attributeUpdate(oldNode, oldAttributes, newAttributes){
    for (let i = 0; i < newAttributes.length; i++) {
        const newAttr = newAttributes[i];
        const oldAttr = oldAttributes.getNamedItem(newAttr.name);

        if (!oldAttr || oldAttr.value !== newAttr.value) {
            oldNode.setAttribute(newAttr.name, newAttr.value);
        }
    }

    for (let i = 0; i < oldAttributes.length; i++) {
        const oldAttr = oldAttributes[i];
        const newAttr = newAttributes.getNamedItem(oldAttr.name);

        if (!newAttr) {
            oldNode.removeAttribute(oldAttr.name);
        }
    }
}

function textUpdate(oldNode, newNode) {
    // nodeType 3 is a text node : https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
    if (!newNode.children.length && newNode?.childNodes[0]?.nodeType === Node.TEXT_NODE && oldNode.innerText !== newNode.innerText) {
        oldNode.innerText = newNode.innerText;
    }
}

function nodesUpdate(parent, oldNodes, newNodes) {
    const addedNodes = [];
    const removedNodes = [];

    for (let i = 0; i < newNodes.length ; i++) {
        const newNode = newNodes[i];
        const oldNode = oldNodes[i];

        if (!newNode || oldNode?.isEqualNode(newNode)) {
            continue;
        }

        if (!oldNode) {
            addedNodes.push(newNode);
        } else if (newNode.nodeName === oldNode.nodeName) {
            attributeUpdate(oldNode, oldNode.attributes, newNode.attributes);
            textUpdate(oldNode, newNode);
            nodesUpdate(oldNode, oldNode.children, newNode.children);
        } else {
            oldNode.replaceWith(newNode);
        }
    }

    forEach(addedNodes,(child) => {
        parent.appendChild(child);
    });

    for (let i = 0; i < oldNodes.length; i++) {
        const newNode = newNodes[i];
        const oldNode = oldNodes[i];

        if (!newNode && !addedNodes.includes(oldNode)) {
            removedNodes.push(oldNode)
        }
    }

    forEach(removedNodes,(child) => {
        child.remove();
    });
}

export function onDomReady(host, instance) {
    if (isFunction(instance.onDestroy)) {
        const observer = new MutationObserver((event) => {
            const isHostElement = some([...event[0].removedNodes], el => el.isEqualNode(host));

            if (isHostElement) {
                instance.onDestroy();
                observer.disconnect();
            }
        });

        observer.observe(host.parentNode || host, {childList: true});

        const hashChangeDestroyer = createEventListener(window, 'hashchange', () => {
            instance.onDestroy();
            observer.disconnect();
            hashChangeDestroyer();
        });
    }

    instance.onDomReady?.();
}

export function onRender(host, dependency, injected) {
    let isFirst = true;
    let counter = 0
    const state = {};

    const _this = {
        host,
        forceUpdate,
        useState
    };

    dependency.apply(_this, injected);

    function forceUpdate(force) {
        const children = castArray(_this.render());
        force ? host.replaceChildren(...children.filter(isElement)) : nodesUpdate(host, host.children, children);
        _this.onRendered?.({isFirst});
    }

    function useState(initialValue){
        counter++;
        state[counter] = initialValue

        return {
            get: () => state[counter],
            set: (value) => {
                if (state[counter] !== value) {
                    state[counter] = value;
                    forceUpdate();
                }
            }
        }
    }

    _this.forceUpdate(true);

    return _this;
}