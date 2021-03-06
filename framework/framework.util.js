import {castArray, forEach, isElement, isFunction} from './commons.js';

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

export function onRender(dependency, props) {
    if (isFunction(dependency.render)) {
        let isFirst = true;

        dependency.props = props;

        dependency.forceUpdate = () => {
            const children = castArray(dependency.render());
            isFirst ? props.host.replaceChildren(...children.filter(isElement)) : nodesUpdate(props.host, props.host.children, children);
            dependency.onRendered?.({isFirst});
            isFirst = false;
        }

        dependency.setState = (newState) => {
            dependency.state = dependency.state || {};
            let stateHasChanged = false;

            forEach(newState, (value, key) => {
                if (dependency.state[key] !== value) {
                    dependency.state[key] = value;
                    stateHasChanged = true;
                }
            });

            stateHasChanged && dependency.forceUpdate();
        }

        dependency.forceUpdate();
    }
}