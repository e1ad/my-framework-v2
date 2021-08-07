import {framework} from '../../framework/framework.js';
import {style} from '../../framework/dom.js';

const StyleGoBackButton = style('button', `
    :host {
      margin-bottom: 10px;
    }
`);

export const GoBackButton = framework.component({
    name: 'GoBackButton',
    injected: ['RouteService']
}, function (RouteService) {
    this.routeService = RouteService;

    this.render = () => {
        return StyleGoBackButton({children: 'Go Back', onClick: this.routeService.goBack});
    }
})
