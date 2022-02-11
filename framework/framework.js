import {createEventListener, isFunction, map, selectElement, some} from './commons.js';
import {onRender} from './framework.util.js';

function Framework() {

    const _self = this;

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

    _self.component = ({name, injected}, dependency) => {
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

    _self.start = () => {
        for (let name in dependencies) {
            const item = dependencies[name];
            !item.singleton && new item.dependency(...getInjectedItem(item));
        }
    }
}

export const framework = new Framework();
