import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import Sinon from 'sinon';

import './components/lit-context.js';
import './components/disconnect-wrapper.js';
import context from '../src/context.js';
import {
  incrementBy,
  decrementBy,
  setMultipleVar,
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
    context.init({ someprop: 0 });

    el.shadowRoot.querySelector('button').click();

    await elementUpdated(el);

    const innerComponent = el.shadowRoot.querySelector('lit-inner-component');
    const result = innerComponent.shadowRoot.getElementById('result');

    expect(result.textContent).to.equal('1');
  });

  it('should inject prop into the compent', async () => {
    const el = await fixture(html`<lit-context></lit-context>`);
    const innerComponent = el.shadowRoot.querySelector('lit-inner-component');
    const result = innerComponent.shadowRoot.getElementById('result');

    expect(result.textContent).to.equal('3');
  });

  it('should set props from child compnent', async () => {
    const el = await fixture(html`<lit-context></lit-context>`);
    const innerComponent = el.shadowRoot.querySelector('lit-inner-component');
    const result = innerComponent.shadowRoot.getElementById('result');
    const btn = innerComponent.shadowRoot.querySelector('button');
    btn.click();

    await elementUpdated(el);

    expect(result.textContent).to.equal('0');
  });

  describe('actions', () => {
    it('should increment the value by 3', async () => {
      const el = await fixture(html`<lit-context></lit-context>`);
      const innerComponent = el.shadowRoot.querySelector('lit-inner-component');
      const result = innerComponent.shadowRoot.getElementById('result');
      const previousValue = +result.textContent;

      incrementBy(3);

      await elementUpdated(el);

      const nextValue = innerComponent.shadowRoot.getElementById('result');
      expect(+nextValue.textContent).to.equal(previousValue + 3);
    });

    it('should decrement the value by 1', async () => {
      const el = await fixture(html`<lit-context></lit-context>`);
      const innerComponent = el.shadowRoot.querySelector('lit-inner-component');
      const result = innerComponent.shadowRoot.getElementById('result');
      const previousValue = +result.textContent;

      decrementBy(1);

      await elementUpdated(el);

      const nextValue = innerComponent.shadowRoot.getElementById('result');
      expect(+nextValue.textContent).to.equal(previousValue - 1);
    });

    it('should set multiple values async', async () => {
      const el = await fixture(html`<lit-context></lit-context>`);
      const innerComponent = el.shadowRoot.querySelector('lit-inner-component');
      const prevValue = innerComponent.shadowRoot.getElementById('result');

      await setMultipleVar('foo', 'bar');

      const nextValue = innerComponent.shadowRoot.getElementById('result');
      expect(prevValue.textContent).to.equal(nextValue.textContent);
      expect(innerComponent.value1).to.equal('foo');
      expect(innerComponent.value2).to.equal('bar');
    });
  });

  describe('observers', () => {
    it('should add component to observers', async () => {
      await fixture(html`<disconnect-wrapper></disconnect-wrapper>`);

      expect(context.observers.someprop.length).to.equal(1);
      expect(context.observers.value1.length).to.equal(1);
      expect(context.observers.value2.length).to.equal(1);
    });

    it('should remove component from observers if component disconnected', async () => {
      const el = await fixture(html`<disconnect-wrapper></disconnect-wrapper>`);
      const spy = Sinon.spy(context, 'deregister');

      el.showContextElement = false;
      await elementUpdated(el);

      expect(spy).to.have.been.called;
      expect(context.observers.someprop.length).to.equal(0);
      expect(context.observers.value1.length).to.equal(0);
      expect(context.observers.value2.length).to.equal(0);
    });

    it('should add references of reusable component to observers', async () => {
      await fixture(
        html`<disconnect-wrapper showReusableElement></disconnect-wrapper>`
      );

      expect(context.observers.someprop[0].component.title).to.equal(
        'undefined'
      );
      expect(context.observers.someprop[1].component.title).to.equal(
        'Reusable'
      );
      expect(context.observers.someprop.length).to.equal(2);
      expect(context.observers.value1.length).to.equal(2);
      expect(context.observers.value2.length).to.equal(2);
    });

    it('should remove the right reference of reusable components from observers', async () => {
      const el = await fixture(
        html`<disconnect-wrapper showReusableElement></disconnect-wrapper>`
      );

      el.showReusableElement = false;
      await elementUpdated(el);

      expect(context.observers.someprop[0].component.title).to.equal(
        'undefined'
      );
      expect(context.observers.someprop.length).to.equal(1);
      expect(context.observers.value1.length).to.equal(1);
      expect(context.observers.value2.length).to.equal(1);
    });
  });
});
