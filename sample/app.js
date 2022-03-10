import {framework} from '../framework/framework.js';
import {TestAService} from './services/serviceA.js';
import {TestBService} from './services/ServiceB.js';
import {Home} from './home/home.js';
import {Routes} from '../framework/routes.js';
import {About} from './about/about.js';
import {Demo} from './demo/demo.js';
import {DomUpdate} from './dom-update/dom-update.js';
import {Analytics} from './analytics/analytics.js';
import {AnalyticsService, ANALYTICS_CUSTOM_EVENT} from '../framework/analyticsService.js';


framework.start();

const App = framework.component({
    name: 'App',
    injected: []
}, function (props) {

    // AnalyticsService(props.host, {category: 'rootApp'}).addEventListener((event)=>{
    //     console.log(event.detail) ;
    // });

    const routes = {
        '/': {
            name: 'home',
            component: Home
        },
        '/about': {
            name: 'about',
            component: About
        },
        '/demo': {
            name: 'about',
            component: Demo
        },
        '/dom-update': {
            name: 'dom-update',
            component: DomUpdate
        },
        '/analytics': {
            name: 'analytics',
            component: Analytics
        }
    };

    Routes(props.host, {
        props: {routes}
    });
});

document.addEventListener('DOMContentLoaded', () => {
    App('#root');
});
