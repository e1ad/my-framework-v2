import {framework} from '../../framework/framework.js';


export const TestBService = framework.service({
    name: 'TestBService',
    injected: ['TestAService'],
    singleton: true,
}, function (TestAService) {

    console.log(TestAService)

});
