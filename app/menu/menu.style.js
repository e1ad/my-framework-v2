import {style} from '../commons.js';

export const MenuListContainer = style('ul', `
:host{
   position: fixed;
   width: 300px;
   list-style-type: none;
   padding:0;
   margin: 0;
   background-color:white;
   border: solid 1px gray;
 }
`);

export const MenuItem = style('li', `
  :host{
    display:flex;
    align-items: center;
    height: 24px;
    padding-left: 5px;
    cursor: pointer;
  }
  
  :host:hover{
    background-color: lightgray;
  }
`);


export const TriggerButton = style('button', `
:host{
  height:24px;
  cursor: pointer;
 }
`);
