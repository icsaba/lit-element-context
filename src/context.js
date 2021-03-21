/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import Observer from "./observer.js";

class Context {

  constructor() {
    this.state = {};

    /** @type {Object.<string, Observer[]>} */
    this.observers = {};
  }

  init(state) {
    this.state = state;
  }

  register(component, componentInstance) {
    Object.entries(component.propsFromContext).forEach( ([propName, aliasName]) => {
      if (!(propName in this.observers)) {
        this.observers[propName] = [];
      }

      this.observers[propName].push(new Observer(aliasName, componentInstance));
    });
  }

  /**
   *
   * @param {string} propName
   * @param {any} value
   */
  setProp(propName, value) {
    this.state[propName] = value;

    if (propName in this.observers) {
      this.observers[propName].forEach(
        observer => {
          observer.component[observer.aliasName] = value;
        }
      );
    }
  }

  connect( component ) {
    const context = this;

    return class extends component {

      constructor(...args) {
        super(...args);

        context.register(component, this);

        Object.entries(component.propsFromContext).forEach( ([propName, newName]) => {
          if (propName in context.state) {
            this[newName] = context.state[propName];
          }
        });
      }

      /**
       *
       * @param {string} propName
       * @param {any} value
       */
      setProp(propName, value) {
        context.setProp(propName, value);
      }
    }
  }
}

export default new Context();
