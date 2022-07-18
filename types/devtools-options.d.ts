import { EnhancerOptions } from 'redux-devtools-extension';

export interface DevToolsOptions extends EnhancerOptions {
  target: (Window | HTMLIFrameElement)
}
