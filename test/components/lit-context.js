import { html, css, LitElement } from 'lit-element';
import './inner-component.js';
import context from '../../src/context.js';


export class LitContext extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--lit-context-text-color, #000);
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      counter: { type: Number },
    };
  }

  constructor() {
    super();

    context.init({
      someprop: 3
    })
  }

  render() {
    return html`
      <button @click=${() => context.setProp('someprop', context.state.someprop + 1) }>increment</button>

      <lit-inner-component></lit-inner-component>
    `;
  }
}

window.customElements.define('lit-context', LitContext);
