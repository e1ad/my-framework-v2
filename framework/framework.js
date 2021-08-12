import {castArray, createEventListener, isElement, isFunction, map, some} from './commons.js';

function Framework() {

    const _self = this;
    const dependencies = {};

    function getInjectedItem(item) {
        return Array.isArray(item.injected) ? getInjected(item.injected) : [];
    }

    function getDependency(item, asNew) {
        return asNew ? new item.dependency(...getInjectedItem(item)) : item.dependency;
    }

    function getInjected(injected) {
        return map(injected, (name) => {
            const item = dependencies[name]
            return getDependency(item, !item.singleton);
        });
    }

    _self.service = ({name, injected, singleton}, dependency) => {
        dependencies[name] = {
            dependency: getDependency({singleton, dependency, injected}, singleton),
            injected,
            singleton
        };

        return dependency;
    }

    function onDomReady(dependency, props) {
        if (isFunction(dependency.onDestroy)) {
            const observer = new MutationObserver((event) => {
                const isHostElement = some([...event[0].removedNodes], el => el.isEqualNode(props.host));

                if (isHostElement) {
                    dependency.onDestroy();
                    observer.disconnect();
                }
            });

            observer.observe(props.host.parentNode, {childList: true});

            const hashChangeDestroyer = createEventListener(window, 'hashchange', () => {
                dependency.onDestroy();
                observer.disconnect();
                hashChangeDestroyer();
            });
        }

        isFunction(dependency.onDomReady) && dependency.onDomReady();
    }

    function attributeUpdate(oldNode, oldAttributes, newAttributes) {
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
        if (!newNode.children.length && newNode?.childNodes[0]?.nodeType === 3 && oldNode.innerText !== newNode.innerText) {
            oldNode.innerText = newNode.innerText;
        }
    }

    function nodesUpdate(parent, oldNodes, newNodes) {
        for (let i = 0; i < newNodes.length; i++) {
            const newNode = newNodes[i];
            const oldNode = oldNodes[i];

            if (oldNode?.isEqualNode(newNode)) {
                continue;
            }

            if (!oldNode) {
                parent.appendChild(newNode);
            } else if (newNode.nodeName === oldNode.nodeName) {
                attributeUpdate(oldNode, oldNode.attributes, newNode.attributes);
                textUpdate(oldNode, newNode);
                nodesUpdate(oldNode, oldNode.children, newNode.children);
            } else {
                oldNode.replaceWith(newNode);
            }
        }

        for (let i = 0; i < oldNodes.length; i++) {
            const newNode = newNodes[i];
            const oldNode = oldNodes[i];

            if (!newNode) {
                oldNode.remove();
            }
        }
    }

    function onRender(dependency, props) {
        if (isFunction(dependency.render)) {
            let isFirst = true;

            dependency.forceUpdate = () => {
                const children = castArray(dependency.render()).filter(isElement);
                !isFirst && nodesUpdate(props.host, props.host.children, children);
                isFirst && props.host.replaceChildren(...children);
                isFirst = false;
                isFunction(dependency.onRendered) && dependency.onRendered({isFirst});
            }

            dependency.forceUpdate();
        }
    }

    _self.component = ({name, injected}, dependency) => {
        return (host, {props} = {}) => {
            return getComponent({host, props, dependency, injected});
        }
    }

    function getComponent({host, props = {}, dependency, injected}) {
        props.host = isElement(host) ? host : document.querySelector(host);
        const _dependency = new dependency(...getInjectedItem({injected}), props);
        onRender(_dependency, props);

        setTimeout(() => {
            onDomReady(_dependency, props);
        });

        return _dependency;
    }

    _self.start = () => {
        for (let name in dependencies) {
            const item = dependencies[name];
            !item.singleton && new item.dependency(...getInjectedItem(item));
        }
    }
}


export const framework = new Framework();
