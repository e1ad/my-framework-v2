import {style} from '../../framework/dom.js';

export const styledButton = style('button', `
 :host {
   display: flex;
   align-items: center;
   height: 20px;
   font-size: 12px;
   outline: none;
   cursor: pointer;
   border: 1px solid transparent;
   border-radius: 0.25rem;
 }
 
 :host.primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
 }
 
 :host.primary:hover {
     background-color: #0069d9;
     border-color: #0062cc;
 }
 
 :host.primary:active {
    background-color: #0062cc;
    border-color: #005cbf;
 }
 
  :host.secondary {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d;
 }
 
 :host.secondary:hover {
    background-color: #5a6268;
    border-color: #545b62;;
 }
`);