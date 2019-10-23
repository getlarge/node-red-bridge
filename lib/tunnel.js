import localtunnel from 'localtunnel';

const tunnel = {};

tunnel.stop = app => {
  try {
    app.set('url', app.get('originUrl'));
    app.tunnel.close();
    return true;
  } catch (error) {
    console.log('tunnel', 'stop', error);
    return error;
  }
};

const createTunnel = async options =>
  new Promise((resolve, reject) => {
    localtunnel(options.port, options, (err, res) => (err ? reject(err) : resolve(res)));
  });

tunnel.init = async (app, conf) => {
  try {
    const options = { port: conf.port, host: conf.tunnel, subdomain: `${conf.name}-${conf.env}` };
    console.log('tunnel', 'init', options);
    if (app.tunnel && app.tunnel.url) {
      return app.tunnel;
      //  app.tunnel.close();
    }
    app.tunnel = await createTunnel(options);
    console.log('tunnel', 'start', app.tunnel.url);

    //  app.tunnel.on('error', async err => {
    //  console.log('nodered', 'tunnel:err', err);
    ///  return app.tunnel.close();
    //  });

    app.tunnel.on('close', () => {
      console.log('tunnel', 'closed', app.tunnel.url);
      // setTimeout restart tunnel
    });
    return app;
  } catch (error) {
    console.log('tunnel', 'init:err', error);
    return error;
  }
};

export default tunnel;
