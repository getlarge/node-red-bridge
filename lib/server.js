import express from 'express';
import nodeRed from './node-setup';
import tunnel from './tunnel';

const app = express();

app.use('/', express.static('public'));
app.use(express.urlencoded({ extended: false }));

const unless = (paths, redirect) => {
  return (req, res, next) => {
    if (paths.some((p) => req.path.indexOf(p) > -1)) {
      return next();
    }
    return res.redirect(redirect);
  };
};

app.authenticate = async (req, res) => {
  let auth = false;
  if (!req.headers.authorization || !req.headers['x-access-token']) return false;
  let token = req.headers.authorization || req.headers['x-access-token'];
  const validToken = process.env.NODE_RED_ADMIN_PASSHASH;
  if (token === validToken) {
    auth = true;
  }
  return auth;
};

app.start = async (config) => {
  try {
    console.log('server', 'start');
    if (config.tunnel) {
      await tunnel.init(app, config);
    }
    await nodeRed.init(app, config);

    app.emit('started', config);
    // node red admin api
    app.get(`/start`, async (req, res) => {
      try {
        const auth = await app.authenticate(req, res);
        if (!auth) {
          res.status(403);
          res.json({ success: false, response: 'Auth failure' });
          return res.end();
        }
        if (!(await nodeRed.isStarted())) {
          await app.close();
          await app.init();
          res.status(200);
          res.json({ success: true, response: 'Node-red started' });
          return res.end();
        }
        res.status(200);
        res.json({ success: true, response: 'Node-red already started' });
        return res.end();
      } catch (error) {
        console.log('nodered', 'start:err', error);
        throw error;
      }
    });

    app.get(`/stop`, async (req, res) => {
      try {
        const auth = await app.authenticate(req, res);
        if (!auth) {
          res.json({ success: false, response: 'Auth failure' });
          return res.end();
        }
        const state = await nodeRed.stop();
        //  return state
        res.json({ success: true, response: 'Node-red stopped' });
        return res.end();
      } catch (error) {
        console.log('nodered', 'stop:err', error);
        throw error;
      }
    });

    app.get(`/restart`, async (req, res) => {
      try {
        const auth = await app.authenticate(req, res);
        if (!auth) {
          res.json({ success: false, response: 'Auth failure' });
          return res.end();
        }
        await nodeRed.stop();
        await app.close();
        await app.start();
        res.json({ success: true, response: 'Node-red restarted' });
        return res.end();
      } catch (error) {
        console.log('nodered', 'restart:err', error);
        throw error;
      }
    });

    return app;
  } catch (error) {
    console.log('server', 'start:err', error);
    throw error;
  }
};

/**
 * Close the app and services
 * @method module:Server.stop
 */
app.stop = async (signal) => {
  try {
    console.log('server', 'stop', signal);
    app.emit('stopped', signal);
    let exit = await nodeRed.stop();
    if (app.tunnel) {
      exit = await tunnel.stop(app);
    }
    console.log('exit', exit);
    return true;
  } catch (error) {
    console.log('server', 'stop:err', error);
    throw error;
  }
};

/**
 * Emit publish event
 * @method module:Server.publish
 */
app.publish = (topic, payload) => {
  app.emit('publish', topic, payload);
};

/**
 * Bootstrap the application, configure models, datasources and middleware.
 * @method module:Server.init
 * @param {object} config - Parsed env variables
 */
app.init = (config) => {
  try {
    console.log('server', 'init', `${config.NODE_NAME} / ${config.NODE_ENV}`);

    const formattedConf = {
      env: config.NODE_ENV,
      name: config.NODE_NAME,
      url: config.NODE_RED_URL,
      host: config.NODE_RED_HOST,
      port: Number(config.NODE_RED_PORT),
      httpAdminRoot: config.NODE_RED_ADMIN_ROOT,
      httpNodeRoot: config.NODE_RED_API_ROOT,
      uiPath: config.NODE_RED_UI_PATH,
      username: config.NODE_RED_USERNAME,
      userPass: config.NODE_RED_USERPASS,
      httpNodeAuth: config.NODE_RED_HTTP_AUTH,
      passHash: config.NODE_RED_PASSHASH,
      userDir: config.NODE_RED_USER_DIR,
      sessionSecret: config.NODE_RED_SESSION_SECRET || 'very secret secret',
      credentialSecret: config.NODE_RED_CREDENTIAL_SECRET || null,
      storeType: config.NODE_RED_STORE_TYPE,
      aloesEmail: config.ALOES_USER_EMAIL,
      aloesPassword: config.ALOES_USER_PASSWORD,
      aloesHost: config.ALOES_HTTP_HOST,
      aloesApiRoot: config.ALOES_HTTP_API_ROOT,
      aloesPort: Number(config.ALOES_HTTP_PORT),
      tunnel: config.TUNNEL_URL,
    };

    const routes = [
      'start',
      'stop',
      'restart',
      'auth-aloes',
      formattedConf.httpAdminRoot,
      formattedConf.httpNodeRoot,
    ];

    app.set('originUrl', formattedConf.url);
    app.set('url', formattedConf.url);
    app.set('host', formattedConf.host);
    app.set('port', formattedConf.port);

    app.use('/', unless(routes, `${formattedConf.httpNodeRoot}/${formattedConf.uiPath}`));

    return app.start(formattedConf);
  } catch (error) {
    console.log('server', 'init:err', error);
    throw error;
  }
};

export default app;
