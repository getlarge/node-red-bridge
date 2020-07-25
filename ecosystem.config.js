const dotenv = require('dotenv');

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

module.exports = {
  apps: [
    {
      name: `${result.parsed.NODE_NAME}-${result.parsed.NODE_ENV}`,
      script: './dist/index.js',
      interpreter: 'node',
      watch: ['lib/*', '.env'],
      ignore_watch: [
        'lib/flows/*',
        'lib/functions/*',
        'lib/uitemplates/*',
        'deploy',
        'nodes_modules',
        '*.test.js',
        '*.json',
      ],
      watch_options: {
        followSymlinks: false,
      },
      output: `./log/${result.parsed.NODE_NAME}-${result.parsed.NODE_ENV}.out.log`,
      error: `./log/${result.parsed.NODE_NAME}-${result.parsed.NODE_ENV}.error.log`,
      max_memory_restart: '1G',
      restart_delay: 500,
      wait_ready: true,
      listen_timeout: 3000,
      env: {
        NODE_ENV: result.parsed.NODE_ENV,
      },
      env_staging: {
        NODE_ENV: 'staging',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
