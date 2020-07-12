import dotenv from 'dotenv';
import nodeCleanup from 'node-cleanup';
import app from './server';

app.on('started', () => {
  const baseUrl = app.get('url').replace(/\/$/, '');
  console.log('node-red-bridge', 'started', `Browse ${process.env.NODE_NAME} API @: ${baseUrl}`);
  //  process.send('ready');
});

app.on('stopped', (signal) => {
  console.log('node-red-bridge', 'stopped', signal);
  // setTimeout(() => process.exit(0), 2000);
});

if (require.main === module) {
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
  app.init(result.parsed);
}

nodeCleanup((exitCode, signal) => {
  try {
    if (signal) {
      console.log('process', 'exit:req', { exitCode, signal, pid: process.pid });
      return app
        .stop(signal)
        .then(() => {
          nodeCleanup.uninstall(); // don't call cleanup handler again
          // process.exit(0);
          return false;
        })
        .catch((e) => {
          throw e;
        });
    }
    return true;
  } catch (error) {
    console.log('process', 'exit:err', error);
    return process.exit(1);
  }
});

export default app;
