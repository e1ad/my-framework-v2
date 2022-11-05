import {createEventListener, forEach, isFunction, map, some} from './commons.js';
import {createElement } from './dom.js';
import {onRender} from './framework.util.js';

function Framework() {

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

    function onDomReady(host, dependency) {
        if (isFunction(dependency.onDestroy)) {
            const observer = new MutationObserver((event) => {
                const isHostElement = some([...event[0].removedNodes], el => el.isEqualNode(host));

                if (isHostElement) {
                    dependency.onDestroy();
                    observer.disconnect();
                }
            });

            observer.observe(host.parentNode, {childList: true});

            const hashChangeDestroyer = createEventListener(window, 'hashchange', () => {
                dependency.onDestroy();
                observer.disconnect();
                hashChangeDestroyer();
            });
        }

        dependency.onDomReady?.();
    }

    function renderComponent(component, props)  {
        const host = createElement('div');
        const instance = component(host, props);
        props?.ref?.(instance);

        return host;
    }

    function component({name, injected}, dependency) {
        const createComponent =  (host, props = {}) => {
            const _dependency = new dependency(...getInjectedItem({injected}), props);
            _dependency.host = host;
            _dependency.props = props;
            onRender(host,_dependency);

            setTimeout(() => {
                onDomReady(host, _dependency);
            });

            return _dependency
        };

        return (props) => renderComponent(createComponent, props);
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
