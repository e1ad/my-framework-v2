import {createEventListener, forEach, isFunction, map, selectElement, some} from './commons.js';
import {onRender} from './framework.util.js';

function Framework() {

    const COMPONENT_NAME_ATTRIBUTE = 'component-name';
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

    function service({name, injected, singleton}, dependency) {
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

    function component({name, injected}, dependency) {
        return (host, {props} = {}) => {
            return renderComponent({name,host, props, dependency, injected});
        }
    }

    function renderComponent({name, host, props = {}, dependency, injected}) {
        props.host = selectElement(host);
        props.host.setAttribute(COMPONENT_NAME_ATTRIBUTE, name);
        const _dependency = new dependency(...getInjectedItem({injected}), props);
        onRender(_dependency, props);

        setTimeout(() => {
            onDomReady(_dependency, props);
        });

        return _dependency;
    }

    function start() {
        forEach(dependencies, (item) => {
            !item.singleton && new item.dependency(...getInjectedItem(item));
        });
    }

    return {
        service,
        component,
        start
    }
}

export const framework = Framework();
