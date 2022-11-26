import {framework} from '../../framework/framework.js';
import {el} from '../../framework/dom.js';
import {GoBackButton} from '../go-back/go-back.js';

export const About = framework.component({
    injected: []
}, function () {

    this.render = () => {
        return [
            GoBackButton(),
            el('br')(),
            el('div')('About page')
        ];
    }
})
