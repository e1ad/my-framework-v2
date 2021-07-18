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
    }, class App {

        routes = {
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

        constructor(props) {
            Routes(props.host, {
                props: {routes: this.routes}
            })
        }
    }
);

document.addEventListener('DOMContentLoaded', () => {
    App('#root');
});
