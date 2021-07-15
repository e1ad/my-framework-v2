import {
    createElement,
    creatDomElements,
    createEventListener,
    forEach,
    find,
    isNil,
    reduce,
    style,
    styleElement,
    isNumber
} from '../commons.js';
import {ERROR_MESSAGE, ERROR_CODE} from './form.const.js';


const fieldContainer = style('div', `
    :host {
        display: flex;
        flex-direction: column;
        margin-bottom: 2px;
    }
    
    :host label {
       font-size: 14px;
    }
`);

const errorContainer = style('div', `
 :host {
   height: 20px;
   font-size: 12px;
 }
`);

export class CreateForm {
    static MAIN_CLASS = 'create-from-container';
    static DEFAULT_SUBMIT_TEXT = 'Save';
    static ERROR_CONTAINER_CLASS = 'error-container';

    _values = {};

    constructor(config) {
        this.config = config;
        this.form = document.querySelector(this.config.target);
        this.form.classList.add(CreateForm.MAIN_CLASS);
        createEventListener(this.form, 'change', this.onFormChange.bind(this));
        this.createFields();
        this.createSubmitButton();
    }

    createFields() {
        forEach(this.config.fields, field => {
            this.form.append(fieldContainer({
                    attr: {field: field.name},
                    children: [
                        {
                            tag: 'label',
                            children: field.label
                        },
                        this.getInputByType(field),
                        errorContainer({attr: {class: CreateForm.ERROR_CONTAINER_CLASS}})
                    ]
                })
            );
        });
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

        const checkboxContainer = reduce(field.items, (acc, item) => {
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
        }, []);

        return createElement('div', {class: 'checkbox-container'}, checkboxContainer);
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

    createSubmitButton() {
        this.form.append(creatDomElements({
                tag: 'button',
                children: this.config.submit.text || CreateForm.DEFAULT_SUBMIT_TEXT,
                event: {
                    name: 'click',
                    callback: (event) => {
                        event.preventDefault();
                        this.config.submit.onClick(this._values);
                    }
                }
            })
        );
    }

    getFieldElement(field) {
        return this.form.querySelector(`[field=${field.name}]`);
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
        const errorElement = this.getFieldElement(field).querySelector(`.${CreateForm.ERROR_CONTAINER_CLASS}`);
        const error = this.getFieldErrors(field);

        const isRequired = this.getErrorMessage(error, ERROR_CODE.REQUIRED);
        const isMin = this.getErrorMessage(error, ERROR_CODE.MIN_NUMBER);

        errorElement.innerText = isRequired + isMin;

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
        const field = find(this.config.fields, field => field.name === name);
        this._values[name] = this.getValueByType(field, input);
        this.handleError(field, input);
    }

    setValues(values) {
        Object.assign(this._values, values);
    }

}

export const RequiredValidator = (field, values) => {
    return isNil(values[field.name]) ? {[ERROR_CODE.REQUIRED]: ERROR_MESSAGE[ERROR_CODE.REQUIRED]} : null;
};

export const minNumberValidator = (min) => {
    return (field, values) => {
        return isNumber(values[field.name]) && values[field.name] > min ? null : {[ERROR_CODE.MIN_NUMBER]: ERROR_MESSAGE[ERROR_CODE.MIN_NUMBER]}
    };
}
