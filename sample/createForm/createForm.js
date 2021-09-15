import {
    find,
    isNil,
    reduce,
    isNumber,
    map
} from '../../framework/commons.js';
import {createElement, creatDomElements, styleElement} from '../../framework/dom.js'
import {ERROR_MESSAGE, ERROR_CODE} from './form.const.js';
import {ErrorContainer, FieldContainer} from './createForm.style.js';
import {framework} from '../../framework/framework.js';
import {el} from '../../framework/dom.js';

export const CreateForm = framework.component({
    name: 'CreateForm',
    injected: [],
}, class CreateForm {
    _errorsRef = {}
    _values = {};

    constructor(props) {
        props.host.classList.add('create-from-container');
    }

    getFields() {
        return map(this.props.fields, (field) => FieldContainer({
                children: [
                    el('label')(field.label),
                    this.getInputByType(field),
                    ErrorContainer({
                        ref: (el) => this._errorsRef[field.name] = el,
                    })
                ]
            })
        );
    }

    getDefaultInput(field) {
        return el('input', {
            type: field.type,
            name: field.name,
            ...field.attributes
        })();
    }

    getSelectInput(field) {
        return el('select', {name: field.name})(
            field.items.map(item => ({
                    tag: 'option',
                    attr: {value: item.value},
                    children: item.name
                })
            )
        );
    }

    getCheckboxInput(field) {
        this._values[field.name] = {};

        return el('div', 'class=checkbox-container')(
            reduce(field.items, (acc, item) => {
                const id = `${field.name}-${item.name}`.replaceAll(' ', '_');

                acc.push(
                    el('input', {
                        type: 'checkbox',
                        value: item.value,
                        name: field.name,
                        id
                    })(),
                    el('label', {for: id})(item.name)
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
        return el('button')({
            children: this.props.submit.text || 'Save',
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

    getErrorInfo(field){
        const error = this.getFieldErrors(field);
        return reduce([ERROR_CODE.REQUIRED, ERROR_CODE.MIN_NUMBER], (acc, errorCode)=> {
            const message = (error && error[errorCode]) || ''
            acc.isValid = acc.isValid || message;
            acc.message += message;
            return acc;
        },{ isValid : false, message:'' });
    }

    handleError(field, input) {
        const {isValid, message} = this.getErrorInfo(field);
        this._errorsRef[field.name].innerText = message;
        styleElement(input, {border: `solid 1px ${isValid ? 'red' : 'black'}`})
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
        return el('form')({
            event: {
                name: 'change',
                callback: this.onFormChange.bind(this)
            },
            children: [
                ...this.getFields(),
                this.getSubmitButton()
            ]
        });
    }
})


const getValidatorValue = (isError, errorCode) => {
    return isError ? {[errorCode]: ERROR_MESSAGE[errorCode]} : null;
};

export const validator = {
    required: (field, values) => getValidatorValue(isNil(values[field.name]), ERROR_CODE.REQUIRED),
    minNumber: (min) => (field, values) => getValidatorValue(!(isNumber(values[field.name]) && values[field.name] > min), ERROR_CODE.MIN_NUMBER)
};
