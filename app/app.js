import {CreateForm, validator} from './createForm/createForm.js';
import {Menu} from './menu/menu.js';
import {framework} from '../framework/framework.js';
import {TestAService} from './services/serviceA.js';
import {TestBService} from './services/ServiceB.js';


framework.start();

document.addEventListener('DOMContentLoaded', (event) => {

    CreateForm('#app-from', {
        props: {
            initOpen: false,
            fields: [
                {
                    name: 'first_name',
                    type: 'text',
                    label: 'First Name',
                },
                {
                    name: 'last_name',
                    type: 'text',
                    label: 'Last Name',
                    validators: [validator.required]
                },
                {
                    name: 'age',
                    type: 'number',
                    label: 'Age',
                    attributes: {
                        min: 0,
                        step: 1
                    },
                    validators: [validator.minNumber(18)]
                },
                {
                    name: 'county',
                    type: 'select',
                    label: 'County',
                    items: [
                        {
                            value: 'li',
                            name: 'Israel'
                        },
                        {
                            value: 'us',
                            name: 'United State'
                        }
                    ]
                },
                {
                    name: 'city',
                    type: 'checkbox',
                    label: 'City',
                    items: [
                        {
                            value: 'li',
                            name: 'Israel'
                        },
                        {
                            value: 'us',
                            name: 'United State'
                        }
                    ]
                },
            ],
            submit: {
                text: 'Save Now',
                onClick: (values) => {
                    console.log(values)
                }
            }
        }
    });

    const menu = Menu('#menu', {
        props: {
            trigger: 'Hello world',
            closeOnSelect: true,
            onToggle: (isOpen) => {
                console.log(`is ${isOpen ? 'open' : 'close'}`);
            },
            onSelect: (item) => {
                console.log(item);
            },
            onDestroy: () => {
                console.log('menu destroyed')
            },
            items: [
                {
                    name: 'item 1',
                },
                {
                    name: 'item 2',
                },
                {
                    name: 'item 3',
                }
            ]
        }
    });

    document.querySelector('.destroy-menu-button').addEventListener('click', () => {
        menu.props.host.remove();
    });

});
