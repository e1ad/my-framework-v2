import {style} from '../../framework/dom.js';

export const FieldContainer = style('div', `
    :host {
        display: flex;
        flex-direction: column;
        margin-bottom: 2px;
    }
    
    :host label {
       font-size: 14px;
    }
`);

export const ErrorContainer = style('div', `
 :host {
   height: 20px;
   font-size: 12px;
 }
`);
