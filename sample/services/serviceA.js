import {framework} from '../../framework/framework.js';


export const TestAService = framework.service({
    name: 'TestAService',
    injected: []
}, function () {

    this.a = 'hello world'

})
