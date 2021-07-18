import {
    createElement,
    creatDomElements,
    createEventListener,
    find,
    isNil,
    reduce,
    styleElement,
    isNumber,
    map
} from '../../framework/commons.js';
import {ERROR_MESSAGE, ERROR_CODE} from './form.const.js';
import {ErrorContainer, FieldContainer} from './createForm.style.js';
import {framework} from '../../framework/framework.js';

export const CreateForm = framework.component({
    name: 'CreateForm',
    injected: [],
    hostBinding: (host) => {
        host.classList.add('create-from-container');
    },
}, class CreateForm {
    static DEFAULT_SUBMIT_TEXT = 'Save';
    static ERROR_CONTAINER_CLASS = 'error-container';

    _errorsRef = {}
    _values = {};

    constructor(props) {
        this.props = props;
    }

    getFields() {
        return map(this.props.fields, (field) => FieldContainer({
                children: [
                    {
                        tag: 'label',
                        children: field.label
                    },
                    this.getInputByType(field),
                    ErrorContainer({
                        attr: {class: CreateForm.ERROR_CONTAINER_CLASS},
                        ref: (el) => this._errorsRef[field.name] = el,
                    })
                ]
            })
        );
    }

    getDefaultInput(field) {
        return createElement('input', {
            type: field.type,
            name: field.name,
            ...field.attributes
        });
    }

    getSelectInput(field) {
        return creatDomElements({
            tag: 'select',
            attr: {name: field.name},
            children: field.items.map(item => ({
                    tag: 'option',
                    attr: {value: item.value},
                    children: item.name
                })
            )
        });
    }

    getCheckboxInput(field) {
        this._values[field.name] = {};

        return createElement('div',
            {class: 'checkbox-container'},
            reduce(field.items, (acc, item) => {
                const id = `${field.name}-${item.name}`;

                acc.push(
                    createElement('input', {
                        type: 'checkbox',
                        value: item.value,
                        name: field.name,
                        id: id
                    }),
                    createElement('label', {for: id}, item.name)
                );

                return acc;
            }, [])
        );
    }

    getInputByType(field) {
        switch (field.type) {
            case 'select':
                return this.getSelectInput(field);
            case 'checkbox':
                return this.getCheckboxInput(field);
            default:
                return this.getDefaultInput(field);
        }
    }

    getSubmitButton() {
        return creatDomElements({
            tag: 'button',
            children: this.props.submit.text || CreateForm.DEFAULT_SUBMIT_TEXT,
            onClick: (event) => {
                event.preventDefault();
                this.props.submit.onClick(this._values);
            }
        });
    }

    getFieldErrors(field) {
        return reduce(field.validators, (acc, validator) => {
            const error = validator(field, this._values) || {};
            return {...acc, ...error};
        }, {});
    }

    getErrorMessage(error, errorCode) {
        return (error && error[errorCode]) || '';
    }

    handleError(field, input) {
        const error = this.getFieldErrors(field);

        const isRequired = this.getErrorMessage(error, ERROR_CODE.REQUIRED);
        const isMin = this.getErrorMessage(error, ERROR_CODE.MIN_NUMBER);

        this._errorsRef[field.name].innerText = isRequired + isMin;

        styleElement(input, {border: `solid 1px ${isRequired || isMin ? 'red' : 'black'}`})
    }

    getValueByType(field, input) {
        switch (field.type) {
            case 'number':
                return input.valueAsNumber;
            case 'checkbox':
                return {...this._values[field.name], [input.value]: input.checked};
            default:
                return input.value;
        }
    }

    onFormChange(event) {
        const input = event.target;
        const name = input.attributes.name.value;
        const field = find(this.props.fields, field => field.name === name);
        this._values[name] = this.getValueByType(field, input);
        this.handleError(field, input);
    }

    render() {
        return [
            creatDomElements({
                tag: 'form',
                event: {
                    name: 'change',
                    callback: this.onFormChange.bind(this)
                },
                children: [
                    ...this.getFields(),
                    this.getSubmitButton()
                ]
            })
        ];
    }
})


export const validator = {
    required: (field, values) => {
        return isNil(values[field.name]) ? {[ERROR_CODE.REQUIRED]: ERROR_MESSAGE[ERROR_CODE.REQUIRED]} : null;
    },
    minNumber: (min) => {
        return (field, values) => {
            return isNumber(values[field.name]) && values[field.name] > min ? null : {[ERROR_CODE.MIN_NUMBER]: ERROR_MESSAGE[ERROR_CODE.MIN_NUMBER]}
        }
    }
};
