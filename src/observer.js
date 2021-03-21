/**
 * @typedef {Object} Component
 * @property {Object.<string, string>} propsFromState
 *
 * @typedef {import('lit-element').LitElement} LitElement
 * @typedef {LitElement & Component} LitComponent
 *
 */

export default class Observer {
  /**
   *
   * @param {string} alias
   * @param {LitComponent} component
   */
  constructor(alias, component) {
    this.aliasName = alias;
    this.component = component;
  }
}
