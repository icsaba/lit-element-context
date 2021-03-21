import { html, fixture, expect, elementUpdated } from '@open-wc/testing';

import './components/lit-context.js';
import context from '../src/context.js';

describe('LitContext', () => {
  it('should init the context', async () => {
    await fixture(html`<lit-context></lit-context>`);

    expect(context.state.someprop).to.equal(3);
  });

  it('should increment someprop by 1', async () => {
    const el = await fixture(html`<lit-context></lit-context>`);

    el.shadowRoot.querySelector('button').click();

    expect(context.state.someprop).to.equal(4);
  });

  it('should rerender the subcomponent if someprop changes', async () => {
    const el = await fixture(html`<lit-context></lit-context>`);
    context.init({someprop: 0});

    el.shadowRoot.querySelector('button').click();

    await elementUpdated(el);

    const innerComponent = el.shadowRoot.querySelector('lit-inner-component');
    const result = innerComponent.shadowRoot.getElementById("result");

    expect(result.textContent).to.equal('1');
  });

  it('should inject prop into the compent', async () => {
    const el = await fixture(html`<lit-context></lit-context>`);
    const innerComponent = el.shadowRoot.querySelector('lit-inner-component');
    const result = innerComponent.shadowRoot.getElementById("result");

    expect(result.textContent).to.equal('3');
  });

  it('should set props from child compnent', async () => {
    const el = await fixture(html`<lit-context></lit-context>`);
    const innerComponent = el.shadowRoot.querySelector('lit-inner-component');
    const result = innerComponent.shadowRoot.getElementById("result");
    const btn = innerComponent.shadowRoot.querySelector("button");
    btn.click();

    await elementUpdated(el);

    expect(result.textContent).to.equal('0');
  });
});
