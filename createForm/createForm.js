import {
    createElement,
    creatDomElements,
    createEventListener,
    forEach,
    find,
    isNil,
    reduce,
    style
} from '../commons.js';
import {ERROR_MESSAGE, ERROR_CODE} from './form.const.js';


const fieldContainer = style('div',`
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

    values = {};

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
            this.form.append(fieldContainer({field: field.name}, [
                {
                    tag: 'label',
                    children: field.label
                },
                this.getInputByType(field),
                errorContainer({class: CreateForm.ERROR_CONTAINER_CLASS})
            ]));
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
        this.values[field.name] = {};

        const checkboxContainer = reduce(field.items, (acc, item) => {
            const id = `${field.name}-${item.name}`;

            acc.push(createElement('input', {
                type: 'checkbox',
                value: item.value,
                name: field.name,
                id: id
            }));

            acc.push(createElement('label', {for: id}, item.name));

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
                        this.config.submit.onClick(this.values);
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
            const error = validator(field, this.values) || {};
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

        errorElement.innerText = isRequired;
        input.style.border = `solid 1px ${isRequired ? 'red' : 'black'}`;
    }

    getValueByType(field, input) {
        switch (field.type) {
            case 'number':
                return input.valueAsNumber;
            case 'checkbox':
                return {...this.values[field.name], [input.value]: input.checked};
            default:
                return input.value;
        }
    }

    onFormChange(event) {
        const input = event.target;
        const name = input.attributes.name.value;
        const field = find(this.config.fields, field => field.name === name);
        this.values[name] = this.getValueByType(field, input);
        this.handleError(field, input);
    }

}


export const RequiredValidator = (field, values) => {
    return isNil(values[field.name]) ? {[ERROR_CODE.REQUIRED]: ERROR_MESSAGE[ERROR_CODE.REQUIRED]} : null;
};

