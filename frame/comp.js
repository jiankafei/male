import {
  nul,
} from './util';

export default ({
  methods,
  ...options,
}) => {
  const app = getApp();
  const innerMethods = nul();
  for (const name of ['created', 'attached', 'ready', 'moved', 'detached', 'error']) {
    delete options[name];
  }
  for (const [key, val] of Object.entries(methods)) {
    innerMethods[key] = function(event = nul()) {
      const result =  val.call(this, event);
      typeof app.methodCaptured === 'function' && app.methodCaptured({
        is: this.is,
        name: key,
        event,
        result,
        instance: this,
      });
      return result;
    };
  }
  Component({
    methods: innerMethods,
    ...options,
  });
};