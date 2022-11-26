import {framework} from '../../framework/framework.js';
import {styledButton} from './button.styled.js';

export const Button = framework.component({
    name: 'Button',
    injected: [],
}, function ({children, theme, onClick, className, ...rest}){

    this.render = () => {
        return styledButton({children, onClick, attr: { className: [theme, className]} , ...rest })
    };
})
