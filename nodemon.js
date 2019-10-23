const nodemon = require('nodemon');

nodemon({
  script: './dist/index.js',
  ext: 'js json',
  watch: ['dist/*', '.env'],
  ignore: [
    'dist/flows/*',
    'dist/functions/*',
    'dist/uitemplates/*',
    'deploy',
    'nodes_modules',
    '*.test.js',
    '*.json',
  ],
  // execMap: {
  //   js: './node_modules/@babel/node/bin/babel-node.js',
  // },
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
