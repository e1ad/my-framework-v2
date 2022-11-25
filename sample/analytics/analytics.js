import {framework} from '../../framework/framework.js';
import {el} from '../../framework/dom.js';
import {GoBackButton} from '../go-back/go-back.js';
import {AnalyticsService, getAnalyticsAsAttribute} from '../../framework/analyticsService.js';

export const Analytics = framework.component({
    name: 'analytics',
    injected: []
}, function () {
    let section1 = null;
    let section2 = null;
    const isButtonShow = this.useState(false);

    this. onDomReady= () => {
        AnalyticsService(section1, {category: 'section1'}).addEventListener((event) => {
            console.log(event.detail) ;
        });

        AnalyticsService(section2, {category: 'section2'}).addEventListener((event) => {
            console.log(event.detail) ;
        });
    }

    function toggleShowButton()  {
        isButtonShow.set(!isButtonShow.get())
    }

    this.render = () => {
        return [
            GoBackButton(),
            el('br')(),
            el('section')({
                ref: (ref) => section1 = ref,
                children:[
                    el('input',getAnalyticsAsAttribute('on-input','input'))('Click'),
                ]
            }),
            el('br')(),
            el('br')(),
            el('section')({
               ref: (ref) => section2 = ref,
               children:[
                   el('button')({
                       children: `${isButtonShow.get() ? 'hide' : 'show'} button`,
                       onClick: toggleShowButton
                   }),
                   el('br')(),
                   el('br')(),
                   isButtonShow.get() && el('button', getAnalyticsAsAttribute('on-button','click,mouseover'))('Click'),
               ]
            })
        ];
    }
})
