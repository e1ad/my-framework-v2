import {style} from "../commons.js";

export const menuListContainer = style('ul', `
:host{
   list-style-type: none;
   padding:0;
   margin: 0;
   position: absolute;
   top:36px;
   width: 300px;
   background-color:white;
   border: solid 1px gray;
 }
`);

export const menuItem = style('li', `
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


export const triggerButton = style('button', `
:host{
  height:24px;
  cursor: pointer;
 }
`);
