import {map} from './commons.js';

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

    component({name, injected}, dependency) {
        this._components[name] = {dependency, injected};

        return (...props) => {
            this._getComponent({name, props});
        }
    }

    _getComponent({name, props}) {
        const component = this._components[name];
        const propsArray = Array.isArray(props) ? props : [];

        return new component.dependency(...this._getInjectedItem(component), ...propsArray);
    }

    start() {
        for (let name in this._dependencies) {
            const item = this._dependencies[name];

            new item.dependency(...this._getInjectedItem(item));
        }
    }
}


export const framework = new Framework();
