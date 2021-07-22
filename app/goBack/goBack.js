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
}, class GoBackButton {

    constructor(RouteService, props) {
        props.host.addEventListener('click', RouteService.goBack);
    }

    render() {
        return StyleGoBackButton({children: 'Go Back'});
    }
})
