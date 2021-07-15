import {clickOutside, map} from '../commons.js';
import {menuItem, menuListContainer, triggerButton} from './menu.style.js';

export class Menu {

    constructor(target, config) {
        this.target = document.querySelector(target);
        this.config = config;

        this.triggerButton = triggerButton({
            children: config.trigger,
            event: {
                name: 'click',
                callback: this.onToggle.bind(this),
            }
        });

        this.target.append(this.triggerButton);

        config.initOpen && this.createMenuList();
    }

    createMenuList() {
        const ul = menuListContainer({
            children: map(this.config.items, (item) => menuItem({
                children: item.name,
                event: {
                    name: 'click',
                    callback: (event) => this.onItemClick(item, event)
                }
            }))
        });

        this.target.append(ul);

        this.destroyClickOutside && this.destroyClickOutside();

        this.destroyClickOutside = clickOutside(ul,{ whitelist: [this.triggerButton] ,onClick:this.onToggle.bind(this)});
    }

    onToggle(event) {
        const ul = [...this.target.children].find(child => child.nodeName === "UL");
        ul ? ul.remove() : this.createMenuList();

        this.config.onToggle && this.config.onToggle(event);
    }

    onItemClick(item, event) {
        this.config.onSelect(item, event);
    }

}
