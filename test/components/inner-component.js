import { html, LitElement } from 'lit-element';
import context from '../../src/context.js';
import {setMultipleVar} from './actions.js';

class LitInnerComponent extends LitElement {

  static get properties() {
    return {
      // renamedProp: {type: Number},
      someprop: {type: Number, fromtContext: true},
      value1: {type: String, fromtContext: true},
      value2: {type: String, fromtContext: true}
    }
  }

  // static get propsFromContext() {
  //   return {
  //     someprop: 'renamedProp',
  //     value1: 'value1',
  //     value2: 'value2'
  //   }
  // }

  render() {
    return html`
      <div>
        Value of the prop: <span id="result">${this.someprop}</span>

        <button @click=${() => this.setProp('someprop', 0) }>reset</button>
      </div>
      <div>
        <div>
          <button @click=${ async () => { await setMultipleVar('value1 set', 'asdasd') }}>set value1 and value3</button>
        </div>
        value1: ${ this.value1 } <br/>
        value2: ${ this.value2 }
      </div>
    `;
  }
}

window.customElements.define('lit-inner-component', context.connect(LitInnerComponent));

