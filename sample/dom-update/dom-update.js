import {framework} from '../../framework/framework.js';
import {GoBackButton} from '../go-back/go-back.js';
import {el} from '../../framework/dom.js';

export const DomUpdate = framework.component({
    name: 'DomUpdate',
    injected: [],
}, function (){
    const counter = this.useState(0);

    const onAddClick = (add) =>{
        counter.set(counter.get() + add);
    }

    this.render = ()=> {
      return [
          GoBackButton(),
          el('div')({
              style:{
                display: 'flex'
              },
              children: [
                  el('button')({
                      children: '-',
                      onClick: () => onAddClick(-1)
                  }),
                  el('div')(counter.get()),
                  el('button')({
                      children: '+',
                      onClick: () => onAddClick(1)
                  }),
              ]
          })
      ];
    };

})
