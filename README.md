**Running**  
run on any localhost environment, for fast start :

```js  
run : npm
install - g
serve
run : serve  
```

**Node version**  
Developed on node version 16.3.0

## Framework options

**Dependencies Injection**

```js  
// define a service
export const TestAService = framework.service({
        name: 'TestAService',
        injected: []
    }, function () {
    }
)
// inject the service to another service
export const TestBService = framework.service({
        name: 'TestBService',
        singleton: true, // create a single instance for this service
        injected: ['TestAService'],
    }, function (TestAService) {
    }
);
```

**Define your own single page routing**

```js  
const App = framework.component({
    injected: []
}, function () {

    //routes definition
    const routes = {
        '/': {
            name: 'home',
            component: Home
        },
        '/about': {
            name: 'about',
            component: About
        }
    };

    this.render = () => {
        return component(Routes)({routes});
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // set an element with an id named 'root' in your index.html file
    App(document.querySelector('#root'));
});
```

**Dom change detection**

Only the changed element will be rerender
```js 
export const DomUpdate = framework.component({
    injected: [],
}, function () {
    const counter = this.useState(0);

    const interval = setInterval(() => {
        counter.set((previousValue) => previousValue + 1);
    }, 1000);

    this.onDestroy = () => {
        clearInterval(interval);
    }

    this.render = () => {
        return el('div')(`counter = ${counter.get()}`);
    };
})
```
