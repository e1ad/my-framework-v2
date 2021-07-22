import {framework} from './framework.js';
import {RouteService} from './routeService.js';

export const Routes = framework.component({
    name: 'Routes',
    injected: ['RouteService', 'Broadcast'],
}, class Routes {

    constructor(RouteService, Broadcast, props) {
        this.routeService = RouteService;
        this.props = props;

        Broadcast.on('routeChange', this.routeChange.bind(this));
    }

    loadComponent(route) {
        route.component && route.component(this.props.host);
    }

    routeChange() {
        const {routes} = this.props;

        const hash = window.location.hash.substr(1);

        if (routes[hash]) {
            this.routeService.addHistory(hash);
            this.loadComponent(routes[hash])
        } else {
            this.routeService.addHistory('/');
            this.loadComponent(routes['/'])
        }
    }

});
