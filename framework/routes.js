import {framework} from './framework.js';
import {RouteService} from './routeService.js';
import {component} from './dom.js';

export const Routes = framework.component({
    name: 'Routes',
    injected: ['RouteService', 'Broadcast'],
}, function (RouteService, Broadcast, props){

    RouteService.setRoutes(props.routes);

    Broadcast.on('routeChange', () => {
        this.forceUpdate(true);
    });

    this.render = () => {
        const {routes} = props;

        const hash = window.location.hash.substr(1);

        const route = routes[hash] ? routes[hash] : routes['/'];

        return component(route.component)(props);
    }
});
