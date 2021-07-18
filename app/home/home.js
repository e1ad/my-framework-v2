import {framework} from '../../framework/framework.js';
import {creatDomElements} from '../../framework/commons.js';

export const Home = framework.component({
    name: 'Home',
    injected: []
}, class Home {

    render() {
        return creatDomElements({
            tag: 'ul',
            children: [
                {
                    tag: 'li',
                    children: [
                        {
                            tag: 'a',
                            attr: {href: '#/demo'},
                            children: 'Demo'
                        },
                    ]
                },
                {
                    tag: 'li',
                    children: [
                        {
                            tag: 'a',
                            attr: {href: '#/about'},
                            children: 'About'
                        },
                    ]
                }
            ]
        });
    }
});
