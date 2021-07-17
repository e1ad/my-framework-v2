import {clickOutside, map, noop, styleElement} from '../../framework/commons.js';
import {MenuItem, MenuListContainer, TriggerButton} from './menu.style.js';
import {framework} from '../../framework/framework.js';


export const Menu = framework.component({
    name: 'Menu',
    injected: []
}, class Menu {
    destroyClickOutside = noop;

    constructor(props) {
        this.host = props.host;
        this.props = props;

        this.createTriggerButton();

        props.initOpen && this.onToggle();
    }

    createTriggerButton() {
        this.triggerButton = TriggerButton({
            children: this.props.trigger,
            onClick: this.onToggle.bind(this),
        });

        this.host.append(this.triggerButton);
    }

    createMenuList() {
        const ul = MenuListContainer({
            children: map(this.props.items, (item) => MenuItem({
                children: item.name,
                onClick: (event) => this.onItemClick(item, event)
            }))
        });

        const {height, top, left} = this.triggerButton.getBoundingClientRect()

        this.host.append(styleElement(ul, {
            left: `${left}px`,
            top: `${height + top + 2}px`,
        }));

        this.destroyClickOutside = clickOutside(ul, {
            whitelist: [this.triggerButton],
            onClick: this.onToggle.bind(this)
        });
    }

    onToggle() {
        this.destroyClickOutside();

        const ul = this.host.querySelector('ul');
        ul ? ul.remove() : this.createMenuList();

        this.props.onToggle && this.props.onToggle(!ul);
    }

    onItemClick(item, event) {
        this.props.closeOnSelect && this.onToggle();
        this.props.onSelect && this.props.onSelect(item, event);
    }

    onDestroy(){
        this.destroyClickOutside();
        this.props.onDestroy && this.props.onDestroy();
    }
})
