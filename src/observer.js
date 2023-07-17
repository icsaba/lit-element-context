export default class Observer {
  /**
   *
   * @param {string} alias
   * @param {import('lit-element').LitElement} component
   */
  constructor(alias, component) {
    this.aliasName = alias;

    if (window.WeakRef) {
      this.ref = new WeakRef(component);
    } else {
      this.ref = component;
    }
  }

  get component() {
    if (window.WeakRef) {
      return /** @type {WeakRef<import('lit-element').LitElement>} */ (this.ref).deref();
    }

    return this.ref;
  }
}
