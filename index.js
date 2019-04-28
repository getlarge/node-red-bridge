const nodemon = require('nodemon');

nodemon({
  script: 'lib/server.js',
  ext: 'js json',
  ignore: ['lib/flows/*', 'lib/uitemplates/*', 'nodes_modules', '*.test.js', '*.json'],
  watch: ['lib/*', '*.js', '.env', 'deploy/*'],
});

nodemon
  .on('start', () => {
    console.log('App has started');
  })
  .on('quit', () => {
    console.log('App has quit');
    process.exit();
  })
  .on('restart', files => {
    console.log('App restarted due to: ', files);
  });
