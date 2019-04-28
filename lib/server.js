const express = require('express');
const dotenv = require('dotenv');
const localtunnel = require('localtunnel');
const nodeCleanup = require('node-cleanup');
const nodeSetup = require('./node-setup');

let httpServer;
let tunnel;
const app = express();

app.use('/', express.static('public'));
app.use(express.urlencoded({ extended: false }));

const unless = (paths, redirect) => {
  return (req, res, next) => {
    if (paths.some(p => req.path.indexOf(p) > -1)) {
      return next();
    }
    return res.redirect(redirect);
  };
};

app.authenticate = async (req, res) => {
  try {
    let auth = false;
    if (!req.headers.authorization || !req.headers['x-access-token']) return false;
    let token = req.headers.authorization || req.headers['x-access-token'];
    const adminToken = process.env.NODE_RED_ADMIN_PASSHASH;
    if (token === adminToken) {
      auth = true;
    }
    return auth;
  } catch (error) {
    return error;
  }
};

app.close = async () => {
  try {
    tunnel.close();
    httpServer.close();
    return app.emit('closed');
  } catch (error) {
    return error;
  }
};

app.publish = (topic, payload) => {
  app.emit('publish', topic, payload);
};

app.createTunnel = conf => {
  try {
    const options = { host: conf.tunnel, subdomain: conf.name };
    //  console.log('nodered', 'tunnel:create', options);
    localtunnel(conf.port, options, (err, res) => {
      if (err) throw err;
      tunnel = res;
      // if (tunnel && !tunnel.url.startsWith(conf.name)) { return tunnel.close()}
      console.log('nodered', 'tunnel:url', tunnel.url);
      //  return tunnel;
    });
  } catch (error) {
    return error;
  }
};

app.start = async () => {
  try {
    const result = await dotenv.config();
    if (result.error) {
      throw result.error;
    }

    const config = {
      name: result.parsed.NODE_NAME,
      url: result.parsed.NODE_RED_URL,
      host: result.parsed.NODE_RED_HOST,
      port: Number(result.parsed.NODE_RED_PORT),
      httpAdminRoot: result.parsed.NODE_RED_ADMIN_ROOT,
      httpNodeRoot: result.parsed.NODE_RED_API_ROOT,
      uiPath: result.parsed.NODE_RED_UI_PATH,
      username: result.parsed.NODE_RED_USERNAME,
      userPass: result.parsed.NODE_RED_USERPASS || 'test',
      passHash: result.parsed.NODE_RED_PASSHASH,
      userDir: result.parsed.NODE_RED_USER_DIR,
      sessionSecret: result.parsed.NODE_RED_SESSION_SECRET || 'very secret secret',
      credentialSecret: result.parsed.NODE_RED_CREDENTIAL_SECRET || null,
      storeType: result.parsed.NODE_RED_STORE_TYPE,
      aloesEmail: result.parsed.ALOES_USER_EMAIL,
      aloesPassword: result.parsed.ALOES_USER_PASSWORD,
      aloesHost: result.parsed.ALOES_HTTP_HOST,
      aloesPort: Number(result.parsed.ALOES_HTTP_PORT),
      tunnel: result.parsed.TUNNEL_URL,
    };

    app.set('url', config.url);
    app.set('host', config.host);
    app.set('port', config.port);

    app.use(
      '/',
      unless([config.httpAdminRoot, config.httpNodeRoot], `${config.httpNodeRoot}${config.uiPath}`),
    );

    if (config.tunnel && (!tunnel || !tunnel.url)) {
      await app.createTunnel(config);
      //  tunnel = await app.createTunnel(config);
    }

    httpServer = await nodeSetup.init(app, config);
    if (httpServer && httpServer !== null) {
      return app.emit('started', config);
    }
    return app.close();
  } catch (error) {
    return error;
  }
};

app.on('started', conf => {
  //  app.use(`${conf.httpNodeRoot}start`, app.authenticate);

  // node red admin api
  app.get(`${conf.httpNodeRoot}/start`, async (req, res) => {
    try {
      const auth = await app.authenticate(req, res);
      if (!auth) {
        res.status(403);
        res.json({ success: false, response: 'Auth failure' });
        return res.end();
      }
      if (!(await nodeSetup.isStarted())) {
        app.close();
        app.start();
        res.status(200);
        res.json({ success: true, response: 'Node-red started' });
        return res.end();
      }
      res.status(200);
      res.json({ success: true, response: 'Node-red already started' });
      return res.end();
    } catch (error) {
      console.log('nodered', 'start:err', error);
      return error;
    }
  });

  app.get(`${conf.httpNodeRoot}/stop`, async (req, res) => {
    try {
      const auth = await app.authenticate(req, res);
      if (!auth) {
        res.json({ success: false, response: 'Auth failure' });
        return res.end();
      }
      const state = await nodeSetup.stop();
      //  return state
      res.json({ success: true, response: 'Node-red stopped' });
      return res.end();
    } catch (error) {
      console.log('nodered', 'stop:err', error);
      return error;
    }
  });

  app.get(`${conf.httpNodeRoot}/restart`, async (req, res) => {
    try {
      const auth = await app.authenticate(req, res);
      if (!auth) {
        res.json({ success: false, response: 'Auth failure' });
        return res.end();
      }
      await nodeSetup.stop();
      app.close();
      app.start();
      res.json({ success: true, response: 'Node-red restarted' });
      return res.end();
    } catch (error) {
      console.log('nodered', 'restart:err', error);
      return error;
    }
  });

  // localtunnel events

  tunnel.on('error', err => {
    //  console.log('nodered', 'tunnel:err', err);
    tunnel.close();
  });

  tunnel.on('close', () => {
    console.log('nodered', 'tunnel:closed');
    // setTimeout restart tunnel
  });
});

app.start();

nodeCleanup((exitCode, signal) => {
  if (signal) {
    app.close(err => {
      console.log('close app : ', exitCode, signal, err);
      process.kill(process.pid, signal);
    });
    nodeCleanup.uninstall(); // don't call cleanup handler again
    return false;
  }
});

module.exports = app;
