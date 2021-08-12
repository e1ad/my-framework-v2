import {framework} from '../../framework/framework.js';
import {component, el} from '../../framework/dom.js';
import {GoBackButton} from '../go-back/go-back.js';

export const About = framework.component({
    name: 'About',
    injected: []
}, class About {

    render() {
        return [
            component(GoBackButton)(),
            el('br')(),
            el('div')('About page')
        ];
    }
})
