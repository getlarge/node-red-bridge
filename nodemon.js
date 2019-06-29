const nodemon = require('nodemon');

nodemon({
  script: './lib/index.js',
  ext: 'js json',
  watch: ['lib/*', '*.js', '.env'],
  ignore: ['lib/flows/*', 'lib/uitemplates/*', 'deploy', 'nodes_modules', '*.test.js', '*.json'],
  execMap: {
    js: './node_modules/@babel/node/bin/babel-node.js',
  },
});

nodemon
  .on('start', () => {
    console.log('App has started');
  })
  // .on('quit', () => {
  //   console.log('App has quit');
  //   process.exit();
  // })
  .on('restart', files => {
    console.log('App restarted due to: ', files);
  });
