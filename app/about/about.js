import {framework} from '../../framework/framework.js';
import {createElement} from '../../framework/dom.js';

export const About = framework.component({
    name: 'About',
    injected: []
}, class About {

    render() {
        return createElement('div', null, 'About page');
    }
})
