// import Em from 'ember';
import DS from 'ember-data';

export default DS.Store.extend({
  // adapterFor: function(type) {
  //   if (!this.typeAdapter) {
  //     this.typeAdapter = {};
  //   }
  //   if (!this.typeAdapter[type]) {
  //     var namespaces = [];
  //     var adapter = this._super(type);
  //     var octosmashedService = this.container.lookup('service:octosmashed');

  //     if (adapter.namespace) {
  //       namespaces = adapter.namespace.split('/');
  //     }

  //     namespaces.push(octosmashedService.namespace);

  //     var namespace = namespaces.join('/');

  //     if (Em.isEmpty(namespace)) {
  //       namespace = undefined;
  //     }

  //     var OctosmashedAdapter = adapter.constructor.extend({
  //       namespace: namespace
  //     });

  //     this.typeAdapter[type] = OctosmashedAdapter.create();
  //   }

  //   return this.typeAdapter[type];
  // },
});
