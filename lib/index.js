import dotenv from 'dotenv';
import nodeCleanup from 'node-cleanup';
import path from 'path';
import app from './server';

app.once('started', async conf => {
  try {
    console.log('node-red-bridge', 'started', `${conf.NODE_NAME}`);
    await app.init(conf);
    return true;
  } catch (error) {
    throw error;
  }

  //  process.send('ready');
});

app.once('stopped', async signal => {
  try {
    console.log('node-red-bridge', 'stopped', signal);
    await app.stop();
    return true;
  } catch (error) {
    throw error;
  }
});

if (require.main === module) {
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
  app.emit('started', result.parsed);
}

nodeCleanup((exitCode, signal) => {
  try {
    if (signal && signal !== null) {
      console.log('process', 'exit:req', { exitCode, signal, pid: process.pid });
      app.emit('stopped', signal);
      // setTimeout(() => process.exit(0), 1500);
      setTimeout(() => process.kill(process.pid, signal), 1500);
      nodeCleanup.uninstall();
      return false;
    }
    return true;
  } catch (error) {
    console.log('process', 'exit:err', error);
    process.kill(process.pid, signal);
    throw error;
  }
});

export default app;
