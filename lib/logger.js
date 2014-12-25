var chalk = require('chalk');

module.exports = {

  warning: function(message) {
    console.log(chalk.yellow('Warning: ' + message));
  },

  success: function(message) {
    console.log(chalk.green('Warning: ' + message));
  },

}
