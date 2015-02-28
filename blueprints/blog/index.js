var logger = require('lib/logger');
var stringUtil = require('../../lib/utilities/string');

module.exports = {
  description: 'The default Octosmashed-powered blog',

  afterInstall: function(/* options */) {
    logger.success('Blog built successfully!');
  },

  locals: function(options) {
    var entity    = options.entity;
    var rawName   = entity.name;
    var name      = stringUtil.dasherize(rawName);
    var namespace = stringUtil.classify(rawName);

    return {
      name: name,
      modulePrefix: name,
      namespace: namespace,
      emberCLIVersion: require('../../package').version,
      octosmashedVersion: '0.1.0', // TODO
    }
  }

  // afterInstall: function(options) {
  //   // Perform extra work here.
  // }
};


// var stringUtil = require('../../lib/utilities/string');

// module.exports = {
//   description: 'The default blueprint for ember-cli projects.',

//   locals: function(options) {
//     var entity    = options.entity;
//     var rawName   = entity.name;
//     var name      = stringUtil.dasherize(rawName);
//     var namespace = stringUtil.classify(rawName);

//     return {
//       name: name,
//       modulePrefix: name,
//       namespace: namespace,
//       emberCLIVersion: require('../../package').version
//     }
//   }
// };
