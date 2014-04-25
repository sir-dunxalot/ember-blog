desc('This is the default task.');
task('default', function (params) {
  console.log('This is the default task.');
});

desc('Publish public dir to github repo');
task('deploy', function (params) {
  var cmds = [
    'git status',
  ]

  jake.exec(cmds, {printStdout: true}, function () {
    console.log('Ran git');
    complete();
  });
});
