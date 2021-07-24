import {framework} from './framework.js';
import {forEach, isFunction} from './commons.js';

export const BroadcastService = framework.service({
    name: 'Broadcast',
    injected: [],
    singleton: true
}, function () {

    const _self = this;

    const _data = {};

    _self.broadcast = (channel, info) => {
        const events = _data[channel];

        if (events) {
            forEach(events, event => {
                event(info);
            })
        }
    }

    _self.on = (channel, cb) => {
        if (isFunction(cb)) {
            _data[channel] = _data[channel] || [];
            _data[channel].push(cb)

            return () => _self.destroy(channel, cb);
        }
    }

    _self.destroy = (channel, cb) => {
        const events = _data[channel];
        const index = events && events.indexOf(cb);

        if (index > -1) {
            events.splice(index, 1);
        }
    }

});
