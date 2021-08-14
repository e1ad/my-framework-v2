import {framework} from '../../framework/framework.js';
import {component, el} from '../../framework/dom.js';
import {GoBackButton} from '../go-back/go-back.js';

export const DomUpdate = framework.component({
    name: 'DomUpdate',
    injected: [],
}, class DomUpdate{
    state = {
        counter: 0
    }

    onAddClick(add){
        this.setState({ counter: this.state.counter + add })
    }

    render() {
      return [
          component(GoBackButton)(),
          el('div')({
              style:{
                display: 'flex'
              },
              children: [
                  el('button')({
                      children: '-',
                      onClick: () => this.onAddClick(-1)
                  }),
                  el('div')(this.state.counter),
                  el('button')({
                      children: '+',
                      onClick: () => this.onAddClick(1)
                  }),
              ]
          })
      ];
    };

})
