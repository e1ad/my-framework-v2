import {framework} from './framework.js';
import {RouteService} from './routeService.js';

export const Routes = framework.component({
    name: 'Routes',
    injected: ['RouteService', 'Broadcast'],
}, function (RouteService, Broadcast, props){

    RouteService.setRoutes(props.routes);

    Broadcast.on('routeChange', () => {
        const {routes, host} = props;

        const hash = window.location.hash.substr(1);

        const route = routes[hash] ? routes[hash] : routes['/'];

        route.component?.(host);
    });
});
