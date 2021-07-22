import {framework} from './framework.js';
import {createEventListener} from './commons.js';
import {BroadcastService} from './broadcast.js';

export const RouteService = framework.service({
    name: 'RouteService',
    injected: ['Broadcast'],
    singleton: true
}, function (Broadcast) {
    
    createEventListener(window, 'DOMContentLoaded', routeChange);
    createEventListener(window, 'hashchange', routeChange);

    function routeChange(event) {
        Broadcast.broadcast('routeChange', event);
    }

    const _self = this;

    const history = [];

    const last = () => history[history.length - 2];

    _self.goTo = (goToPath) => {
        window.location.hash = `#${goToPath}`;

        if (last() !== goToPath) {
            _self.addHistory(goToPath);
        }
    }

    _self.addHistory = (goToPath) => {
        if (history.length > 3) {
            history.splice(history.length - 2);
        }

        history.push(goToPath);
    }

    _self.goBack = () => {
        _self.goTo(last());
    }

});
