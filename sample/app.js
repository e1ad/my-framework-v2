import {framework} from '../framework/framework.js';
import {TestAService} from './services/serviceA.js';
import {TestBService} from './services/ServiceB.js';
import {Home} from './home/home.js';
import {Routes} from '../framework/routes.js';
import {About} from './about/about.js';
import {Demo} from './demo/demo.js';
import {DomUpdate} from './dom-update/dom-update.js';

const App = framework.component({
    injected: []
}, function () {

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
    };

    this.render = () => {
      return Routes({routes});
    }
});

framework.start();

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#root').append(App());
});
