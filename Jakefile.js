var moment = require('moment');

desc('This is the default task.');
task('default', function (params) {
  console.log('This is the default task.');
});

desc('Publish the blog to your github repo\'s master branch');
task('deploy', function (params) {
  var commitMessage = '"Build for deployment on ' + new moment().format('MMMM Do YYYY, h:mm:ss a') + '"';

  var cmds = [
    'brunch build --production',
    'git add .',
    'git commit -m ' + commitMessage,
    'git push origin master'
  ];

  jake.exec(cmds, {printStdout: true}, function () {
    console.log('Successfully published the blog to origin/master');
    complete();
  });
});
