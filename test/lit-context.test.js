import { html, fixture, expect, elementUpdated } from '@open-wc/testing';

import './components/lit-context.js';
import context from '../src/context.js';
import {
  incrementBy,
  decrementBy,
  setMultipleVar
} from './components/actions.js';

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

  describe('actions', () => {
    it('should increment the value by 3', async () => {
      const el = await fixture(html`<lit-context></lit-context>`);
      const innerComponent = el.shadowRoot.querySelector('lit-inner-component');
      const result = innerComponent.shadowRoot.getElementById("result");
      const previousValue = +result.textContent;

      incrementBy(3);

      await elementUpdated(el);

      const nextValue = innerComponent.shadowRoot.getElementById("result");
      expect(+nextValue.textContent).to.equal(previousValue + 3);
    });

    it('should decrement the value by 1', async () => {
      const el = await fixture(html`<lit-context></lit-context>`);
      const innerComponent = el.shadowRoot.querySelector('lit-inner-component');
      const result = innerComponent.shadowRoot.getElementById("result");
      const previousValue = +result.textContent;

      decrementBy(1);

      await elementUpdated(el);

      const nextValue = innerComponent.shadowRoot.getElementById("result");
      expect(+nextValue.textContent).to.equal(previousValue - 1);
    });

    it('should set multiple values async', async () => {
      const el = await fixture(html`<lit-context></lit-context>`);
      const innerComponent = el.shadowRoot.querySelector('lit-inner-component');
      const prevValue = innerComponent.shadowRoot.getElementById("result");

      await setMultipleVar('foo', 'bar');

      const nextValue = innerComponent.shadowRoot.getElementById("result");
      expect(prevValue.textContent).to.equal(nextValue.textContent);
      expect(innerComponent.value1).to.equal('foo');
      expect(innerComponent.value2).to.equal('bar');
    });
  });
});
