import {isElement, isFunction, map} from './commons.js';

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
            this._getComponent({host, name, props, hostBinding});
        }
    }

    _getComponent({host, name, props, hostBinding}) {
        const component = this._components[name];

        props.host = isElement(host) ? host : document.querySelector(host);

        isFunction(hostBinding) && hostBinding(props.host);

        return new component.dependency(...this._getInjectedItem(component), props);
    }

    start() {
        for (let name in this._dependencies) {
            const item = this._dependencies[name];

            new item.dependency(...this._getInjectedItem(item));
        }
    }
}


export const framework = new Framework();
