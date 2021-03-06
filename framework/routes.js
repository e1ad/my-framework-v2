import {framework} from './framework.js';
import {RouteService} from './routeService.js';

export const Routes = framework.component({
    name: 'Routes',
    injected: ['RouteService', 'Broadcast'],
}, class Routes {

    constructor(RouteService, Broadcast, props) {
        this.props = props;
        RouteService.setRoutes(props.routes);

        Broadcast.on('routeChange', this.routeChange);
    }

    routeChange = () => {
        const {routes} = this.props;

        const hash = window.location.hash.substr(1);
        const route = routes[hash] ? routes[hash] : routes['/']
        route.component?.(this.props.host);
    }

});
