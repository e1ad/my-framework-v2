import {
    find,
    isNil,
    reduce,
    isNumber,
    map
} from '../../framework/commons.js';
import {styleElement} from '../../framework/dom.js'
import {ERROR_MESSAGE, ERROR_CODE} from './form.const.js';
import {CreatFormWrapper, ErrorContainer, FieldContainer} from './createForm.style.js';
import {framework} from '../../framework/framework.js';
import {el} from '../../framework/dom.js';
import {Button} from '../button/button.js';

export const CreateForm = framework.component({
    name: 'CreateForm',
    injected: [],
}, function (props) {
    const _errorsRef = {}
    const _values = {};

    function getFields() {
        return map(props.fields, (field) => FieldContainer({
                children: [
                    el('label')(field.label),
                    getInputByType(field),
                    ErrorContainer({ref: (el) => _errorsRef[field.name] = el})
                ]
            })
        );
    }

    function getDefaultInput(field) {
        return el('input', {
            type: field.type,
            name: field.name,
            ...field.attributes
        })();
    }

    function getSelectInput(field) {
        return el('select', {name: field.name})(
            field.items.map(item => ({
                    tag: 'option',
                    attr: {value: item.value},
                    children: item.name
                })
            )
        );
    }

    function getCheckboxInput(field) {
        _values[field.name] = {};

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

    function getInputByType(field) {
        switch (field.type) {
            case 'select':
                return getSelectInput(field);
            case 'checkbox':
                return getCheckboxInput(field);
            default:
                return getDefaultInput(field);
        }
    }

    function getSubmitButton() {
        return Button({
            theme: 'primary',
            children: props.submit.text || 'Save',
            onClick: (event) => {
                event.preventDefault();
                props.submit.onClick(_values);
            }
        });
    }

    function getFieldErrors(field) {
        return reduce(field.validators, (acc, validator) => {
            const error = validator(field, _values) || {};
            return {...acc, ...error};
        }, {});
    }

    function getErrorInfo(field){
        const error = getFieldErrors(field);
        return reduce([ERROR_CODE.REQUIRED, ERROR_CODE.MIN_NUMBER], (acc, errorCode)=> {
            const message = (error && error[errorCode]) || ''
            acc.isValid = acc.isValid || message;
            acc.message += message;
            return acc;
        },{ isValid : false, message:'' });
    }

    function handleError(field, input) {
        const {isValid, message} = getErrorInfo(field);
        _errorsRef[field.name].innerText = message;
        styleElement(input, {border: `solid 1px ${isValid ? 'red' : 'black'}`})
    }

    function getValueByType(field, input) {
        switch (field.type) {
            case 'number':
                return input.valueAsNumber;
            case 'checkbox':
                return {..._values[field.name], [input.value]: input.checked};
            default:
                return input.value;
        }
    }

    function onFormChange(event) {
        const input = event.target;
        const name = input.attributes.name.value;
        const field = find(props.fields, field => field.name === name);
        _values[name] = getValueByType(field, input);
        handleError(field, input);
    }

    this.render = () => {
        return CreatFormWrapper({
            event: {
                name: 'change',
                callback: onFormChange
            },
            children: [
                ...getFields(),
                getSubmitButton()
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
