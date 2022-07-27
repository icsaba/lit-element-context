import { LitElement, html } from 'lit-element';
import './lit-context.js';

export class DisconnectWrapper extends LitElement {
  static get properties() {
    return {
      showContextElement: { type: Boolean },
      showReusableElement: { type: Boolean },
    };
  }

  constructor() {
    super();

    this.showContextElement = true;
    this.showReusableElement = false;
  }

  render() {
    return html`${this.showContextElement ? this.renderContent() : html``}`;
  }

  renderContent() {
    return html`${this.showReusableElement
      ? html`<lit-context></lit-context
          ><lit-context title="Reusable"></lit-context>`
      : html`<lit-context></lit-context>`}`;
  }
}

window.customElements.define('disconnect-wrapper', DisconnectWrapper);
