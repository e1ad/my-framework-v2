import {framework} from '../../framework/framework.js';
import {creatDomElements, el} from '../../framework/dom.js';
import {GoBackButton} from '../goBack/goBack.js';

export const About = framework.component({
    name: 'About',
    injected: []
}, class About {

    render() {
        return [
            creatDomElements({
               tag:'div',
               ref: el => GoBackButton(el)
            }),
            el('br')(),
            el('div')('About page')
        ];
    }
})
