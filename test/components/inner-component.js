import { html, LitElement } from 'lit-element';
import context from '../../src/context.js';

class LitInnerComponent extends LitElement {

  static get properties() {
    return {
      renamedProp: {type: Number}
    }
  }

  static get propsFromContext() {
    return {
      someprop: 'renamedProp'
    }
  }

  render() {
    return html`
      <div>
        Value of the prop: <span id="result">${this.renamedProp}</span>

        <button @click=${() => this.setProp('someprop', 0) }>reset</button>
      </div>
    `;
  }
}

window.customElements.define('lit-inner-component', context.connect(LitInnerComponent));

