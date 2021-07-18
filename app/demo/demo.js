import {framework} from '../../framework/framework.js';
import {Menu} from '../menu/menu.js';
import {CreateForm, validator} from '../createForm/createForm.js';
import {creatDomElements} from '../../framework/commons.js';

export const Demo = framework.component({
    name: 'Demo',
    injected: []
}, class Demo {

    menuProps = {
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
    };

    createFormProps = {
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
    };


    onRendered() {
        this.menu = Menu(this.menuRef, {
            props: this.menuProps
        });

        CreateForm(this.createFormRef, {
            props: this.createFormProps
        });
    }

    render() {
        return creatDomElements({
            tag: 'div',
            children: [
                {
                    tag: 'div',
                    ref: (el) => {
                        this.menuRef = el
                    }
                },
                {
                    tag: 'br'
                },
                {
                    tag: 'div',
                    children: [{
                        tag: 'button',
                        onClick: () => {
                            this.menu.props.host.remove();
                        },
                        children: 'destroy menu'
                    }]
                },
                {
                    tag: 'br'
                },
                {
                    tag: 'div',
                    ref: (el) => this.createFormRef = el
                }
            ]
        });
    }
});
