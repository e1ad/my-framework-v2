import {forEach, map} from './commons.js';
import {createElement} from './dom.js';
import {onDomReady, onRender} from './framework.util.js';

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

    function renderComponent(component, props)  {
        const host = createElement('div');
        const instance = component(host, props);
        props?.ref?.(instance);

        return host;
    }

    function component({name, injected}, dependency) {
        const createComponent =  (host, props = {}) => {
            const instance = onRender(host, dependency, [...getInjectedItem({injected}), props]);

            setTimeout(() => {
                onDomReady(host, instance);
            });

            return instance
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
