import {framework} from './framework.js';
import {createEventListener} from './commons.js';

export const Routes = framework.component({
    name: 'Routes',
    injected: [],
}, class Routes {

    constructor(props) {
        this.props = props;

        const routeChange = this.routeChange.bind(this);

        createEventListener(window, 'DOMContentLoaded', routeChange);
        createEventListener(window, 'hashchange', routeChange);
    }

    loadComponent(route) {
        route.component && route.component(this.props.host);
    }

    routeChange() {
        const {routes} = this.props;

        const hash = window.location.hash.substr(1);

        if (routes[hash]) {
            this.loadComponent(routes[hash])
        } else {
            window.location.hash = '/';
            this.loadComponent(routes['/'])
        }
    }

});
