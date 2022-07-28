import { html, css, LitElement } from 'lit-element';
import './inner-component.js';
import context from '../../src/context.js';
import { incrementBy, decrementBy } from './actions.js';

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
      showInner: { type: Boolean }
    };
  }

  constructor() {
    super();

    context.init(
      {
        someprop: 3,
        value1: 'initial value',
      },
      true,
      { name: 'lit context store' }
    );

    this.showInner = true;
  }

  render() {
    return html`
      <div>
        <button
          @click=${() =>
            context.setProp('someprop', context.state.someprop + 1)}
        >
          increment
        </button>
      </div>
      <div>
        <button id="increment_by_action" @click=${() => incrementBy(3)}>
          increment by 3
        </button>
      </div>
      <div>
        <button id="decrement_by_action" @click=${() => decrementBy(2)}>
          decrement by 2
        </button>
      </div>

      <button @click=${ () => {this.showInner = !this.showInner} }> toggle component</button>

      ${
        this.showInner && html`<lit-inner-component title=${this.title}></lit-inner-component>`
      }
    `;
  }
}

window.customElements.define('lit-context', LitContext);
