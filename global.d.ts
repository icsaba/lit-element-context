import { PropertyValues, UpdatingElement, LitElement } from 'lit-element';

declare module 'lit-element' {
  export interface PropertyDeclaration<Type = unknown, TypeHint = unknown> {
    readonly contextKey?: string;
    readonly fromContext?: boolean;
  }
}

declare global {
  export interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }

  export interface HTMLIFrameElement {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}