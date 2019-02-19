export default ({
  methods,
  ...options,
}) => {
  const app = getApp();
  const innerMethods = Object.create(null);
  for (const name of ['created', 'created', 'ready', 'moved', 'detached', 'error']) {
    delete options[name];
  }
  for (const [key, val] of Object.entries(methods)) {
    innerMethods[key] = function(event = Object.create(null)) {
      const result =  val.call(this, event);
      app.methodCaptured({
        route: this.is,
        name: key,
        event,
        result,
        scope: this,
      });
      return result;
    };
  }
  Component({
    methods: innerMethods,
    ...options,
  });
};