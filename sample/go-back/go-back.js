import {framework} from '../../framework/framework.js';
import {style} from '../../framework/dom.js';
import {Button} from '../button/button.js';

const StyledButton = style(Button, `
    :host {
      margin-bottom: 10px;
    }
`);

export const GoBackButton = framework.component({
    name: 'GoBackButton',
    injected: ['RouteService']
}, function (RouteService, props) {

    this.render = () => {
        return StyledButton({theme: 'secondary', children: 'Go Back', onClick: RouteService.goBack, props})
    }
})
