import {framework} from '../../framework/framework.js';
import {Menu} from '../menu/menu.js';
import {CreateForm, validator} from '../createForm/createForm.js';
import {el} from '../../framework/dom.js';
import {GoBackButton} from '../go-back/go-back.js';

export const Demo = framework.component({
    name: 'Demo',
    injected: []
}, class Demo {
    state = {
        showMenu: true
    }

    menuProps = {
        trigger: 'Hello world',
        closeOnSelect: true,
        initOpen: false,
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

    onDomReady() {
        console.log('onDomReady');
    }

    render() {
        return el('div')([
            GoBackButton(),
            this.state.showMenu && Menu(this.menuProps),
            el('br')(),
            el('div')(
                el('button')({
                    children: 'destroy menu',
                    onClick: () => {
                        this.setState({showMenu: false});
                    },
                })
            ),
            el('br')(),
            CreateForm(this.createFormProps),
        ]);
    }
});
