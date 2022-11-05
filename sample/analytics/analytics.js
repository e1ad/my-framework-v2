import {framework} from '../../framework/framework.js';
import {el} from '../../framework/dom.js';
import {GoBackButton} from '../go-back/go-back.js';
import {AnalyticsService, getAnalyticsAsAttribute} from '../../framework/analyticsService.js';

export const Analytics = framework.component({
    name: 'analytics',
    injected: []
}, class About {
    state = {
        isButtonShow: false
    }

    onDomReady(){
        AnalyticsService(this.section1, {category: 'section1'}).addEventListener((event) => {
            console.log(event.detail) ;
        });

        AnalyticsService(this.section2, {category: 'section2'}).addEventListener((event) => {
            console.log(event.detail) ;
        });
    }

    toggleShowButton = () => {
        this.setState({isButtonShow: !this.state.isButtonShow});
    }

    render() {
        return [
            GoBackButton(),
            el('br')(),
            el('section')({
                ref: (ref) => this.section1 = ref,
                children:[
                    el('input',getAnalyticsAsAttribute('on-input','input'))('Click'),
                ]
            }),
            el('br')(),
            el('br')(),
            el('section')({
               ref: (ref) => this.section2 = ref,
               children:[
                   el('button')({
                       children: `${this.state.isButtonShow ? 'hide' : 'show'} button`,
                       onClick: this.toggleShowButton
                   }),
                   el('br')(),
                   el('br')(),
                    this.state.isButtonShow && el('button', getAnalyticsAsAttribute('on-button','click,mouseover'))('Click'),
               ]
            })
        ];
    }
})
