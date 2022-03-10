import {createEventListener, selectElement} from './commons.js';

export const ANALYTICS_ATTRIBUTE = 'data-analytics';

export const ANALYTICS_USER_EVENT_TYPES = 'data-events'

export const ANALYTICS_CUSTOM_EVENT = 'analytics-custom-event';

const DEFAULT_USER_EVENTS = ['click'];

const USER_EVENTS = ['click', 'mouseover', 'input'];

export const getAnalyticsAsAttribute = (name, userEvent) => ({
    [ANALYTICS_ATTRIBUTE]: name ,
    ...(userEvent && {[ANALYTICS_USER_EVENT_TYPES]: userEvent})
});

export function AnalyticsService (target, { category } = {}) {

    const mainElement = selectElement(target);

    function fireEvent(eventName, value, node) {
        const customEvent = new CustomEvent(ANALYTICS_CUSTOM_EVENT, {
            detail: {
                category,
                name: eventName,
                value,
                node
            }
        });

        mainElement.dispatchEvent(customEvent);
    }

    function getIsAllowEvent(node, eventName){
        const allowEvent = node.getAttribute(ANALYTICS_USER_EVENT_TYPES);

        if (allowEvent) {
            return allowEvent.includes(eventName);
        }


        return DEFAULT_USER_EVENTS.includes(eventName);
    }

    function addEventListener(callback){
        return createEventListener(mainElement,ANALYTICS_CUSTOM_EVENT,callback);
    }

    function shouldFireEvent(node, eventName) {
        const value = node?.getAttribute(ANALYTICS_ATTRIBUTE);

        value && fireEvent(eventName, value, node);
    }

    const findAnalyticsElement = (nodes) => nodes && [...nodes].find(el =>el.getAttribute?.(ANALYTICS_ATTRIBUTE));

    function onFindElement(nodes, eventName){
        shouldFireEvent(findAnalyticsElement(nodes),eventName);
    }

    function onUserEvent(event){
        const node = event.target.closest(`[${ANALYTICS_ATTRIBUTE}]`);
        const eventName = event.type;
        if(node && getIsAllowEvent(node, eventName)) {
            shouldFireEvent(node, eventName);
        }
    }

    function handelUserEvents() {
        return USER_EVENTS.map((eventName) => createEventListener(mainElement, eventName, onUserEvent, false));
    }

    function init() {
        const eventsDestroyers = handelUserEvents();

        const observer = new MutationObserver((event) => {
            event.forEach((item) => {
                onFindElement(item?.removedNodes, 'removed');
                onFindElement(item?.addedNodes, 'added');
            });
        });

        observer.observe(mainElement, {
            childList: true,
            subtree: true,
            attributeFilter: [ANALYTICS_ATTRIBUTE]
        });

        return () => {
            eventsDestroyers.forEach(destroyer => destroyer());
            observer.disconnect();
        }
    }

    const destroy = init();

    return {
        destroy,
        addEventListener
    }
}