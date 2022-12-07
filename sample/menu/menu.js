import {clickOutside, map, noop} from '../../framework/commons.js';
import {styleElement} from '../../framework/dom.js';
import {MenuItem, MenuListContainer, TriggerButton} from './menu.style.js';
import {framework} from '../../framework/framework.js';

export const Menu = framework.component({
    injected: []
}, function (props){
    const isMenuOpen = this.useState(false);
    let triggerButton, destroyClickOutside, ul, buttonPosition = null

    function getMenuList() {
        return MenuListContainer({
            ref: (ref) => ul = ref,
            children: map(props.items, (item) => MenuItem({
                children: item.name,
                onClick: (event) => onItemClick(item, event)
            }))
        });
    }

   this.onRendered = () => {
        if (!ul) {
            return
        }

        setListPosition();

        destroyClickOutside?.();

        destroyClickOutside = clickOutside(ul, {
            whitelist: [triggerButton],
            onClick: onToggle
        });
    }

    function setListPosition(){
        const {left, top, height} = buttonPosition;

        styleElement(ul, {
            left: `${left}px`,
            top: `${height + top + 2}px`,
        })
    }

     this.onDomReady = () => {
        buttonPosition = triggerButton.getBoundingClientRect();
        isMenuOpen.set(props.initOpen);
        ul && setListPosition();
    }

    function onToggle() {
        ul = null;
        isMenuOpen.set((previousValue) => !previousValue);
        props.onToggle?.(isMenuOpen.get());
    }

    function onItemClick(item, event) {
        props.closeOnSelect && onToggle();
        props.onSelect?.(item, event);
    }

    this.onDestroy = () => {
        destroyClickOutside?.();
        props.onDestroy?.();
    }

    this.render = () => {
        return [
            TriggerButton({
                children: props.trigger,
                onClick: onToggle,
                ref: (el) => triggerButton = el
            }),
            isMenuOpen.get() && getMenuList()
        ];
    }
})
