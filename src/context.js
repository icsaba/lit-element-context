/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import Observer from './observer.js';

/**
 * @typedef { import('../types/devtools-options').DevToolsOptions } devToolsOptions
 */

class Context {
  constructor() {
    this.prefix = '#_lit-context_';
    this.state = {};
    this.reduxDevTools = null;

    /** @type {Object.<string, Set<Observer>>} */
    this.observers = {};
  }

  /**
   *
   * @param { Object } state
   * @param { boolean } enableDevTools
   * @param { devToolsOptions } devToolsOptions
   */
  init(state, enableDevTools = false, devToolsOptions = {}) {
    this.state = state;

    if (enableDevTools) {
      const { target, ...options } = devToolsOptions;

      this.reduxDevTools = (
        target || window
      ).__REDUX_DEVTOOLS_EXTENSION__?.connect(options);

      this.reduxDevTools?.init(state);
    }
  }

  /**
   * @private
   * @param {*} component
   * @param {*} componentInstance
   */
  #register(component, componentInstance) {
    Object.entries(component.properties)
      .forEach(([aliasName, property]) => {
        if (property.fromContext) {
          const key = 'contextKey' in property ? property.contextKey : aliasName;

          if (!(key in this.observers)) {
            this.observers[key] = new Set();
          }

          const observer = new Observer(aliasName, componentInstance);

          this.observers[key].add(observer);
          componentInstance[this.#getKey(key)] = observer;

          if (key in this.state) {
            componentInstance[aliasName] = this.state[key];
          }
        }
      });
  }

  /**
   * @private
   * @param {*} component
   * @param {*} componentInstance
   */
  #deregister(component, componentInstance) {
    Object.entries(component.properties)
      .forEach(([aliasName, value]) => {
        if (value.fromContext) {
          const key = 'contextKey' in value ? value.contextKey : aliasName;
          this.observers[key].delete(componentInstance[this.#getKey(key)]);
        }
      });
  }

  /**
   * @private
   * @param {string} key
   * @returns {string}
   */
  #getKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   *
   * @param {string} propName
   * @param {any} value
   */
  setProp(propName, value) {
    this.state[propName] = value;

    if (this.reduxDevTools) {
      this.reduxDevTools.send('setProp', { [propName]: value });
    }

    if (propName in this.observers) {
      for (const {component, aliasName} of this.observers[propName]) {
        component[aliasName] = value;
      }
    }
  }

  /**
   *
   * @param {Object<string, any>} props
   */
  setProps(props) {
    Object.entries(props).forEach(([propName, value]) => {
      this.setProp(propName, value);
    });
  }

  /**
   *
   * @param {(state: Object, ...params: any[]) => void} callback
   * @returns {(...params: any[]) => void}
   */
  action(callback) {
    return (...params) => {
      const nextState = callback(this.state, ...params);
      this.setProps(nextState);
    };
  }

  /**
   *
   * @param {(state: Object, ...params: any[]) => Promise<void>} callback
   * @returns { (...params: any[]) => Promise<void> }
   */
  asyncAction(callback) {
    return async (...params) => {
      const nextState = await callback(this.state, ...params);
      this.setProps(nextState);
    };
  }

  connect(component) {
    const context = this;

    return class extends component {
      constructor(...args) {
        super(...args);

        context.#register(component, this);
      }

      disconnectedCallback() {
        context.#deregister(component, this);
        super.disconnectedCallback();
      }

      /**
       *
       * @param {string} propName
       * @param {any} value
       */
      setProp(propName, value) {
        context.setProp(propName, value);
      }

      /**
       * Accepts key-value pairs
       *
       * @param { Object<string, any>} props
       */
      setProps(props) {
        context.setProps(props);
      }
    };
  }
}

export default new Context();
