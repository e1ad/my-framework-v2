import {castArray, isElement, isFunction, map, some} from './commons.js';

class Framework {

    _dependencies = {};

    _getInjectedItem(item) {
        return Array.isArray(item.injected) ? this._getInjected(item.injected) : [];
    }

    _getDependency(item, asNew) {
        return asNew ? new item.dependency(...this._getInjectedItem(item)) : item.dependency;
    }

    _getInjected(injected) {
        return map(injected, (name) => {
            const item = this._dependencies[name]
            return this._getDependency(item, !item.singleton);
        });
    }

    service({name, injected, singleton}, dependency) {
        this._dependencies[name] = {
            dependency: this._getDependency({singleton, dependency, injected}, singleton),
            injected,
            singleton
        };

        return dependency;
    }

    component({name, injected}, dependency) {
        return (host, {props} = {}) => {
            return this._getComponent({host, props, dependency, injected});
        }
    }

    _getComponent({host, props = {}, dependency, injected}) {

        props.host = isElement(host) ? host : document.querySelector(host);

        const _dependency = new dependency(...this._getInjectedItem({injected}), props);

        if (isFunction(_dependency.onDestroy)) {
            const observer = new MutationObserver((event) => {
                const isHostElement = some([...event[0].removedNodes], el => el.isEqualNode(props.host));

                if (isHostElement) {
                    _dependency.onDestroy();
                    observer.disconnect();
                }
            });

            observer.observe(props.host.parentNode, {childList: true});
        }

        if (isFunction(_dependency.render)) {
            _dependency.forceUpdate = () => {
                const children = castArray(_dependency.render()).filter(isElement);
                props.host.replaceChildren(...children);
                isFunction(_dependency.onRendered) && _dependency.onRendered();
            }

            _dependency.forceUpdate();
        }

        return _dependency;
    }

    start() {
        for (let name in this._dependencies) {
            const item = this._dependencies[name];

            !item.singleton && new item.dependency(...this._getInjectedItem(item));
        }
    }
}


export const framework = new Framework();
