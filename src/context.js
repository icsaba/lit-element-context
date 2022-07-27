/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import Observer from './observer.js';

/**
 * @typedef { import('../types/devtools-options').DevToolsOptions } devToolsOptions
 */

class Context {
  constructor() {
    this.state = {};
    this.reduxDevTools = null;

    /** @type {WeakMap<string, Observer[]>} */
    this.observers = new WeakMap();
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

  register(component, componentInstance) {
    if (component.propsFromContext) {
      Object.entries(component.propsFromContext).forEach(
        ([propName, aliasName]) => {
          if (!(propName in this.observers)) {
            this.observers[propName] = [];
          }

          this.observers[propName].push(
            new Observer(aliasName, componentInstance)
          );

          if (propName in this.state) {
            componentInstance[aliasName] = this.state[propName];
          }
        }
      );
    } else {
      Object.entries(component.properties)
        .filter(([, value]) => value.fromContext)
        .forEach(([aliasName, value]) => {
          const key = 'contextKey' in value ? value.contextKey : aliasName;

          if (!(key in this.observers)) {
            this.observers[key] = [];
          }

          const referenceInObserver = this.observers[key].find(
            observer => observer.component === componentInstance
          );

          if (!referenceInObserver) {
            this.observers[key].push(
              new Observer(aliasName, componentInstance)
            );
          }

          if (key in this.state) {
            componentInstance[aliasName] = this.state[key];
          }
        });
    }
  }

  deregister(component, componentInstance) {
    Object.entries(component.properties)
      .filter(([, value]) => value.fromContext)
      .forEach(([aliasName, value]) => {
        const key = 'contextKey' in value ? value.contextKey : aliasName;
        this.observers[key] = this.observers[key].filter(
          observer => observer.component !== componentInstance
        );
      });
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
      this.observers[propName].forEach(observer => {
        observer.component[observer.aliasName] = value;
      });
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

        context.register(component, this);
      }

      disconnectedCallback() {
        context.deregister(component, this);
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
