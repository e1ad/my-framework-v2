
**Running**  
run on any localhost environment, for fast start :
```js  
run : npm install -g serve  
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
  injected: ['TestAService'],  
}, function (TestAService) {  
   }
);

```
