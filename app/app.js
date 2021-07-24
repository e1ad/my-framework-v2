import {framework} from '../framework/framework.js';
import {TestAService} from './services/serviceA.js';
import {TestBService} from './services/ServiceB.js';
import {Home} from './home/home.js';
import {Routes} from '../framework/routes.js';
import {About} from './about/about.js';
import {Demo} from './demo/demo.js';

framework.start();

const App = framework.component({
    name: 'App',
    injected: []
}, function (props) {

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
        }
    };

    Routes(props.host, {
        props: {routes}
    });
});

document.addEventListener('DOMContentLoaded', () => {
    App('#root');
});
