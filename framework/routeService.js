import {framework} from './framework.js';
import {createEventListener} from './commons.js';
import {BroadcastService} from './broadcast.js';

export const RouteService = framework.service({
    name: 'RouteService',
    injected: ['Broadcast'],
    singleton: true
}, function (Broadcast) {

    const _self = this;

    const history = [];
    const HOME_ROUTE = '/';
    let routes;

    createEventListener(window, 'DOMContentLoaded', routeChange);
    createEventListener(window, 'hashchange', routeChange);

    function routeChange(event) {
        const hash = window.location.hash.substr(1);
        const routeHash = routes[hash] ? hash : HOME_ROUTE;
        addToHistory(routeHash);
        Broadcast.broadcast('routeChange', event);
    }

    const gePrevious = () => history[history.length - 2] || HOME_ROUTE;
    const getLast = () => history[history.length - 1] || HOME_ROUTE;

    _self.goTo = (goToPath) => {
        window.location.hash = `#${goToPath}`;
    }

    function addToHistory(goToPath) {
        if (getLast() === goToPath) {
            return;
        }

        if (history.length > 3) {
            history.splice(history.length - 2);
        }

        history.push(goToPath);
    }

    _self.goBack = () => {
        const previous = gePrevious();
        previous && _self.goTo(previous);
    }

    _self.setRoutes = (_routes) => {
        routes = _routes;
    }

});
