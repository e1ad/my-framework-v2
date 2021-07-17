import {clickOutside, isElement, map, styleElement} from '../../framework/commons.js';
import {MenuItem, MenuListContainer, TriggerButton} from './menu.style.js';
import {framework} from '../../framework/framework.js';


export const Menu = framework.component({
    name: 'Menu',
    injected: []
}, class Menu {

    constructor(target, config) {
        this.target = isElement(target) ? target : document.querySelector(target);
        this.config = config;

        this.createTriggerButton();

        config.initOpen && this.onToggle();
    }

    createTriggerButton() {
        this.triggerButton = TriggerButton({
            children: this.config.trigger,
            event: {
                name: 'click',
                callback: this.onToggle.bind(this),
            }
        });

        this.target.append(this.triggerButton);
    }

    createMenuList() {
        const ul = MenuListContainer({
            children: map(this.config.items, (item) => MenuItem({
                children: item.name,
                event: {
                    name: 'click',
                    callback: (event) => this.onItemClick(item, event)
                }
            }))
        });

        const {height, top, left} = this.triggerButton.getBoundingClientRect()

        this.target.append(styleElement(ul, {
            left: `${left}px`,
            top: `${height + top + 2}px`,
        }));

        this.destroyClickOutside = clickOutside(ul, {
            whitelist: [this.triggerButton],
            onClick: this.onToggle.bind(this)
        });
    }

    onToggle() {
        this.destroyClickOutside && this.destroyClickOutside();

        const ul = this.target.querySelector('ul');
        ul ? ul.remove() : this.createMenuList();

        this.config.onToggle && this.config.onToggle(!ul);
    }

    onItemClick(item, event) {
        this.config.closeOnSelect && this.onToggle();
        this.config.onSelect(item, event);
    }
})
