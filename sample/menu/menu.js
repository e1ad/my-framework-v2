import {clickOutside, map, noop} from '../../framework/commons.js';
import {styleElement} from '../../framework/dom.js';
import {MenuItem, MenuListContainer, TriggerButton} from './menu.style.js';
import {framework} from '../../framework/framework.js';

export const Menu = framework.component({
    name: 'Menu',
    injected: []
}, class Menu {
    destroyClickOutside = noop;
    state = {
        isMenuOpen: false,
    }

    getMenuList() {
        return MenuListContainer({
            ref: (ul) => this.ul = ul,
            children: map(this.props.items, (item) => MenuItem({
                children: item.name,
                onClick: (event) => this.onItemClick(item, event)
            }))
        });
    }

    onRendered() {
        if (!this.ul) {
            return
        }

        this.setListPosition();

        this.destroyClickOutside();

        this.destroyClickOutside = clickOutside(this.ul, {
            whitelist: [this.triggerButton],
            onClick: this.onToggle.bind(this)
        });
    }

    setListPosition(){
        const {left, top, height} = this.buttonPosition;

        styleElement(this.ul, {
            left: `${left}px`,
            top: `${height + top + 2}px`,
        })
    }

    onDomReady() {
        this.buttonPosition = this.triggerButton.getBoundingClientRect();

       this.setState({ isMenuOpen: this.props.initOpen });

        this.ul && this.setListPosition();
    }

    onToggle() {
        this.ul = null;

        this.setState({ isMenuOpen: !this.state.isMenuOpen});

        this.props.onToggle && this.props.onToggle(this.state.isMenuOpen);
    }

    onItemClick(item, event) {
        this.props.closeOnSelect && this.onToggle();
        this.props.onSelect && this.props.onSelect(item, event);
    }

    onDestroy() {
        this.destroyClickOutside();
        this.props.onDestroy && this.props.onDestroy();
    }

    render() {
        return [
            TriggerButton({
                children: this.props.trigger,
                onClick: this.onToggle.bind(this),
                ref: (el) => this.triggerButton = el
            }),

            this.state.isMenuOpen && this.getMenuList()
        ];
    }
})
