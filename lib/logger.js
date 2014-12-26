'use strict';

var chalk = require('chalk');

module.exports = {

  error: function(message) {
    console.log(chalk.red('Error: ' + message));
  },

  success: function(message) {
    console.log(chalk.green('Success: ' + message));
  },

  warning: function(message) {
    console.log(chalk.yellow('Warning: ' + message));
  },

}
