# lit-element-context state manager

A simple state manager for lit-element. I needed something like redux, but something less complicated. It implements a context, and provides a method to set and update properties in the context. 

On every property update, the components get a new data injected into them through props, and as we know, components are rerendered if the properties are changed.

you can find a working example in the `test/components` folder.

## Usage

init the context where ever you want

```javascript
context.init({propName: someval, propName2: {nestedData: []} });
```

connect a lit component to the context
```javascript
class MyLitComponent extends LitElement {}

window.customElements.define('my-lit-component', context.connect(MyLitComponent));
```

specify the props you need from context in your component
```javascript
class MyLitComponent extends LitElement {
  static get properties() {
    return {
      somepropFromContext: {type: Number},
      renamedProp: {type: String}
    }
  }

  static get propsFromContext() {
    return {
      somepropFromContext: 'somepropFromContext',
      somepropFromContext2: 'renamedProp'
    };
  }
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
