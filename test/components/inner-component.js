import { html, LitElement } from 'lit-element';
import context from '../../src/context.js';
import {setMultipleVar} from './actions.js';

class LitInnerComponent extends LitElement {

  static get properties() {
    return {
      // renamedProp: {type: Number},
      renamedProp: {type: Number, fromContext: true, contextKey: 'someprop'},
      value1: {type: String, fromContext: true},
      value2: {type: String, fromContext: true}
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
        Value of the prop: <span id="result">${this.renamedProp}</span>

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

