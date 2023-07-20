import Observer from './observer.js';

/**
 * @typedef { import('../global.js')} placeHolder overrides the consumers global types
 * @typedef { import('../types/devtools-options').DevToolsOptions } devToolsOptions
 * @typedef {import('lit-element').LitElement} LitElement
 * @typedef {typeof import('lit-element').LitElement} LitClass
 */

/**
 * @template {{}} TState
 */
export class Context {
  constructor() {
    this.prefix = '#_lit-context_';

    /** @type {TState} */
    this.state = null;

    this.reduxDevTools = null;

    /** @type {Object.<string, Set<Observer>>} */
    this.observers = {};
  }

  /**
   * @param { TState } state
   * @param { boolean } [enableDevTools]
   * @param { devToolsOptions } [devToolsOptions]
   */
  init(state, enableDevTools = false, devToolsOptions = { target: window }) {
    this.state = state;

    if (enableDevTools) {
      const { target = window, ...options } = devToolsOptions;

      if (target.__REDUX_DEVTOOLS_EXTENSION__) {
        this.reduxDevTools = target.__REDUX_DEVTOOLS_EXTENSION__.connect(options);
        this.reduxDevTools.init(state);
      }
    }
  }

  /**
   * @private
   * @param {LitClass} component
   * @return {{[propName: string]: any}}
   */
  static getProperties(component) {
    if ('elementProperties' in component) {
      return Array.from(/** @type {Iterable<any>} */ (component.elementProperties));
    }

    return Object.entries(component.properties);
  }

  /**
   * @private
   * @param {LitClass} component
   * @param {LitElement} componentInstance
   */
  register(component, componentInstance) {
    const properties = Context.getProperties(component);

    properties.forEach(([aliasName, property]) => {
      if (property.fromContext) {
        const key = 'contextKey' in property ? property.contextKey : aliasName;

        if (!(key in this.observers)) {
          this.observers[key] = new Set();
        }

        const observer = new Observer(aliasName, componentInstance);

        this.observers[key].add(observer);
        componentInstance[this.getKey(key)] = observer;

        if (key in this.state) {
          componentInstance[aliasName] = this.state[key];
        }
      }
    });
  }

  /**
   *
   * @private
   * @param {LitClass} component
   * @param {LitElement} componentInstance
   */
  deregister(component, componentInstance) {
    const properties = Context.getProperties(component);

    properties.forEach(([aliasName, value]) => {
      if (value.fromContext) {
        const key = 'contextKey' in value ? value.contextKey : aliasName;
        this.observers[key].delete(componentInstance[this.getKey(key)]);
      }
    });
  }

  /**
   * @private
   * @param {string} key
   * @returns {string}
   */
  getKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   *
   * @param {string} propName
   * @param {any} value
   * @param {boolean} propsCalled
   */
  setProp(propName, value, propsCalled = false) {
    this.state[propName] = value;

    if (!propsCalled && this.reduxDevTools) {
      this.reduxDevTools.send('setProp', { ...this.state });
    }

    if (propName in this.observers) {
      for (const { component, aliasName } of this.observers[propName]) {
        component[aliasName] = value;
      }
    }
  }

  /**
   *
   * @param {Object<string, any>} props
   * @param {string} [actionName]
   */
  setProps(props, actionName = 'setProp') {
    Object.entries(props).forEach(([propName, value]) => {
      this.setProp(propName, value, true);
    });

    if (this.reduxDevTools) {
      this.reduxDevTools.send(actionName, { ...this.state });
    }
  }

  /**
   *
   * @param {(state: TState, ...params: any[]) => TState} callback
   * @param {string} [actionName]
   * @returns {(...params: any[]) => void}
   */
  action(callback, actionName) {
    return (...params) => {
      const nextState = callback(this.state, ...params);
      this.setProps(nextState, callback.name || actionName);
    };
  }

  /**
   *
   * @param {(state: TState, ...params: any[]) => Promise<TState>} callback
   * @returns { (...params: any[]) => Promise<void> }
   */
  asyncAction(callback) {
    return async (...params) => {
      const nextState = await callback(this.state, ...params);
      this.setProps(nextState);
    };
  }

  /**
   *
   * @param {LitClass} superClass
   */
  connect(superClass) {
    const context = this;

    return class extends superClass {
      constructor() {
        super();

        context.register(superClass, this);
      }

      disconnectedCallback() {
        context.deregister(superClass, this);
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
       * @param { TState } props
       */
      setProps(props) {
        context.setProps(props);
      }
    };
  }

  /**
   *
   * Decorator for ts-lit
   * @returns { (clazz: any) => any }
   */
  connectElement() {
    return clazz => this.connect(clazz);
  }
}

export default new Context();
