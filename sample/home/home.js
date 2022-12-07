import {framework} from '../../framework/framework.js';
import {el} from '../../framework/dom.js';

export const Home = framework.component({
    injected: []
}, function () {

    this.render = () => {
        return el('ul')([
            el('li')(el('a', 'href=#/demo')('Demo')),
            el('li')(el('a', 'href=#/about')('About')),
            el('li')(el('a', 'href=#/dom-update')('Dom Update'))
        ]);
    }
});
