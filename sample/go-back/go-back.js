import {framework} from '../../framework/framework.js';
import {style} from '../../framework/dom.js';
import {Button} from '../button/button.js';

const ButtonWrapper = style('div', `
    :host {
      margin-bottom: 10px;
    }
`);

export const GoBackButton = framework.component({
    name: 'GoBackButton',
    injected: ['RouteService']
}, function (RouteService) {

    this.render = () => {
        return ButtonWrapper({
            children: Button({theme: 'secondary', children: 'Go Back', onClick: RouteService.goBack})
        });
    }
})
