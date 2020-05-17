import localtunnel from 'localtunnel';

const tunnel = {};

tunnel.start = async (app) => {
  try {
    console.log('tunnel', 'start', app.tunnel.url);
    // localtunnel events
    //  app.tunnel.on('error', async err => {
    //  console.log('nodered', 'tunnel:err', err);
    ///  return app.tunnel.close();
    //  });

    app.tunnel.on('close', () => {
      console.log('tunnel', 'closed', app.tunnel.url);
      // setTimeout restart tunnel
    });
    return app.tunnel;
  } catch (error) {
    console.log('tunnel', 'start:err', error);
    throw error;
  }
};

tunnel.stop = async (app) => {
  try {
    app.set('url', app.get('originUrl'));
    app.tunnel.close();
    return true;
  } catch (error) {
    console.log('tunnel', 'stop', error);
    throw error;
  }
};

tunnel.init = async (app, conf) => {
  try {
    const options = { host: conf.tunnel, subdomain: `${conf.name}-${conf.env}` };
    console.log('tunnel', 'init', options);
    if (app.tunnel && app.tunnel.url) {
      return app.tunnel;
      //  app.tunnel.close();
    }

    return localtunnel(conf.port, options, (err, res) => {
      if (err) throw err;
      app.tunnel = res;
      // if (res.url) {
      //   // if (res.url.search(options.subdomain) === -1) {
      //   //   //  console.log('tunnel', 'wrong url', res.url);
      //   //   return app.tunnel.close();
      //   // }
      //   app.set('url', res.url);
      // }
      return tunnel.start(app);
    });
  } catch (error) {
    console.log('tunnel', 'init:err', error);
    throw error;
  }
};

export default tunnel;
