import nodeCleanup from 'node-cleanup';
import {app, init, stop} from './server';

app.on('started', () => {
  const baseUrl = app.get('url').replace(/\/$/, '');
  console.log('node-red-bridge', 'started', `Browse ${process.env.NODE_NAME} API @: ${baseUrl}`);
});

app.on('stopped', (signal) => {
  console.log('node-red-bridge', 'stopped', signal);
});

if (require.main === module) {
  init();
}

nodeCleanup((exitCode, signal) => {
  try {
    if (signal) {
      console.log('process', 'exit:req', { exitCode, signal, pid: process.pid });
      return stop(signal).then(() => {
        nodeCleanup.uninstall(); // don't call cleanup handler again
        // process.exit(0);
        return false;
      });
    }
    return true;
  } catch (error) {
    console.log('process', 'exit:err', error);
    return process.exit(1);
  }
});

export default app;
