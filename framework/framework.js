import {isElement, isFunction, map, some} from './commons.js';

class Framework {

    _dependencies = {};
    _components = {};

    _getInjectedItem(item) {
        return Array.isArray(item.injected) ? this._getInjected(item.injected) : [];
    }

    _getInjected(injected) {
        return map(injected, (name) => {
            const item = this._dependencies[name];
            return new item.dependency(...this._getInjectedItem(item));
        });
    }

    service({name, injected}, dependency) {
        this._dependencies[name] = {dependency, injected};

        return dependency;
    }

    component({name, injected, hostBinding}, dependency) {
        this._components[name] = {dependency, injected};

        return (host, {props}) => {
            return this._getComponent({host, name, props, hostBinding});
        }
    }

    _getComponent({host, name, props, hostBinding}) {
        const component = this._components[name];

        props.host = isElement(host) ? host : document.querySelector(host);

        isFunction(hostBinding) && hostBinding(props.host);

        const dependency = new component.dependency(...this._getInjectedItem(component), props);

        if (isFunction(dependency.onDestroy)) {
            const observer = new MutationObserver((event) => {
                const isHostElement = some([...event[0].removedNodes], el => el === props.host);

                if (isHostElement) {
                    dependency.onDestroy();
                    observer.disconnect();
                }
            });

            observer.observe(props.host.parentNode, {childList: true});
        }

        return dependency;
    }

    start() {
        for (let name in this._dependencies) {
            const item = this._dependencies[name];

            new item.dependency(...this._getInjectedItem(item));
        }
    }
}


export const framework = new Framework();
