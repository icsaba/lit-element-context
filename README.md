# lit-element-context state manager

It supposed to be a simple context provider but somehow it became a store 🪦

It's a simple state manager for lit-element. I needed something like redux, but something less complicated. It implements a store, and provides a method to set and update properties in the store.

On every property update, the components get a new data injected into them through props, and as we know, components are rerendered if the properties are changed.

you can find a working example in the `test/components` folder.


## New features

Version 1.2.5
- [x] changed "module" to "ES6"

Version 1.2.1
- [x] added generic types for state

Version 1.2.0
- [x] added TS support for `lit-ts`

Version 1.1.1
- [x] improved redux devtools usage

Version 1.1.0
- [x] removed deprecated methods
- [x] improved register and deregister methods on lifecycle 

- [x] remove component from observers when disconnected from DOM

Version 1.0.13
- [x] added meta information to the store init method

Version 1.0.12
- [x] added iframe support

Version 1.0.11
- [x] added devtools support

Version 1.0.9
- [x] rename prop with `contextKey` attribute

Version 1.0.6
- [x] `fromContext` attribute in the `properties` getter

Version 1.0.5
- [x] actions and async actions
- [x] setProps method to set multiple values at the same time

## Usage

init the context where ever you want

```javascript
import context from 'lit-element-simple-context';

context.init({propName: someval, propName2: {nestedData: []} });
```

You can use devtools to debug store, pass true as a second parameter to the `init` method.

```javascript
import context from 'lit-element-simple-context';

context.init({...}, true);
```

You can pass devtools options, like store instance name, as third parameter to the `init` method. Watch `devtools-options.d.ts` for available options.

```javascript
import context from 'lit-element-simple-context';

context.init({...}, true, { name: 'lit context store' });
```

connect a lit component to the context in JS
```javascript
import { LitElement } from 'lit';
import context from 'lit-element-simple-context';

class MyLitComponent extends LitElement {}

window.customElements.define('my-lit-component', context.connect(MyLitComponent));
```

connect a lit component to the context in TS
```typescript
import { LitElement, property } from 'lit';
import { Context } from 'lit-element-simple-context';

type MyContextType = {};
const context = new Context<MyContextType>();

@customElement('my-lit-component')
@context.connectElement()
export class MyLitComponent extends LitElement {}
```

To specify the props you need from context in your component, you should set `fromContext` attribute in the `properties` getter. 
If the lit property name is different what you use in the store, you can specify it with `contextKey` attribute

```javascript
class MyLitComponent extends LitElement {
  static get properties() {
    return {
      somepropFromContext: {type: Number, fromContext: true},
      renamedProp: {type: String, fromContext: true, contextKey: 'somepropInTheStore'}
    }
  }
}
```

You can do it in TS as well with either using the default typings or your custom state type:
```typescript
import { LitElement } from 'lit';
import context from 'lit-element-simple-context';

@customElement('my-lit-component')
@context.connectElement()
export class MyLitComponent extends LitElement {

  @property({fromContext: true})
  somepropFromContext = '';
  
}
```

With custom types: 

```typescript
import { LitElement, property } from 'lit';
import { Context } from 'lit-element-simple-context';

type MyContextType = {};
const context = new Context<MyContextType>();

@customElement('my-lit-component')
@context.connectElement()
export class MyLitComponent extends LitElement {

  @property({fromContext: true})
  somepropFromContext = '';
  
}
```

change a value in the store once the component is connected to the store
```javascript
this.setProp('somepropFromContext2', 0);
```

change a value in the store if the component is not connected to the store
```javascript
import context from 'lit-element-simple-context';

context.setProp('someprop', context.state.someprop + 1);
```

You can use actions (and async actions as well) instead of `setProp` method calls.

```javascript 
// actions.js
import context from 'lit-element-simple-context';

export const incrementBy = context.action((state, value) => ({someprop: state.someprop + value}));

export const asyncAction = context.asyncAction(async (_, value1, value2) => ({ value1, value2}));


// some-other-file.js
import { asyncAction, incrementBy } from './actions.js';

async function foo() {
  await asyncAction('foo', 'bar');

  incrementBy(1);
}
```

that's it!! there is no need of tons of boilerplate code and every component gets the fresh data on change.

## Testing with Web Test Runner
To run the suite of Web Test Runner tests, run
```bash
yarn test
```

To run the tests in watch mode 

```bash
yarn test:watch
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`
```bash
yarn start
```
To run a local development server that serves the basic demo located in `demo/index.html`
