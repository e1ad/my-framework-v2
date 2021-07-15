import {CreateForm, minNumberValidator, RequiredValidator} from './createForm/createForm.js';
import {Menu} from "./menu/menu.js";


document.addEventListener('DOMContentLoaded', (event) => {
    new CreateForm({
        target: '#app-from',
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
                validators: [RequiredValidator]
            },
            {
                name: 'age',
                type: 'number',
                label: 'Age',
                attributes: {
                    min: 0,
                    step: 1
                },
                validators: [minNumberValidator(18)]
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
    });


    new Menu('#menu', {
        trigger: 'Hello world',
        onToggle: () => {
            console.log('on open');
        },
        onSelect: (item) => {
            console.log(item);
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
    });

});
