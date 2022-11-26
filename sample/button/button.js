import {framework} from '../../framework/framework.js';
import {styledButton} from './button.styled.js';

export const Button = framework.component({
    name: 'Button',
    injected: [],
}, function ({children, theme, onClick, ...rest}){

    this.render = () => {
        return styledButton({children, onClick, attr: { class:theme, ...rest }})
    };
})
