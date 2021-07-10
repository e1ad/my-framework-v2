import { CreateForm, RequiredValidator } from './createForm/createForm.js';



document.addEventListener('DOMContentLoaded', (event) => {
    new CreateForm({
        target: '#app-from',
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
                }
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
});