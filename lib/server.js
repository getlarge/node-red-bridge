import dotenv from 'dotenv';
import express from 'express';
import basicAuth from 'express-basic-auth';
import nodeRed from './node-setup';
import tunnel from './tunnel';

export const app = express();

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

const authenticate = (req, res) => {
  let auth = false;
  if (!req.headers.authorization || !req.headers['x-access-token']) {
    return false;
  }
  const token = req.headers.authorization || req.headers['x-access-token'];
  const validToken = process.env.NODE_RED_ADMIN_PASSHASH;
  if (basicAuth.safeCompare(token, validToken)) {
    auth = true;
  }
  return auth;
};

export const start = async (config) => {
  try {
    console.log('server', 'start');

    // node red admin api
    app.get(`/start`, async (req, res) => {
      try {
        const auth = authenticate(req, res);
        if (!auth) {
          res.status(403);
          res.json({ success: false, response: 'Auth failure' });
          return res.end();
        }
        if (!(await nodeRed.isStarted())) {
          await nodeRed.init(app, config);
          res.status(200);
          res.json({ success: true, response: 'Node-red restarting' });
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
        const auth = authenticate(req, res);
        if (!auth) {
          res.status(401);
          res.json({ success: false, response: 'Auth failure' });
          return res.end();
        }
        const state = await nodeRed.stop();
        //  return state
        res.status(200);
        res.json({ success: true, response: 'Node-red stopped' });
        return res.end();
      } catch (error) {
        console.log('nodered', 'stop:err', error);
        throw error;
      }
    });

    app.get(`/restart`, async (req, res) => {
      try {
        const auth = authenticate(req, res);
        if (!auth) {
          res.status(401);
          res.json({ success: false, response: 'Auth failure' });
          return res.end();
        }
        res.status(200);
        res.json({ success: true, response: 'Application restarting...' });
        res.end();
        await stop();
        return init();
      } catch (error) {
        console.log('nodered', 'restart:err', error);
        throw error;
      }
    });

    app.emit('started', config);

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
export const stop = async (signal) => {
  try {
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
 */
export const init = async () => {
  try {
    const result = dotenv.config();
    if (result.error) {
      throw result.error;
    }
    const config = result.parsed;
    console.log('server', 'init', `${config.NODE_NAME} / ${config.NODE_ENV}`);

    const options = {
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
      tunnel: config.TUNNEL_URL,
    };

    const routes = [
      'start',
      'stop',
      'restart',
      'auth-aloes',
      options.httpAdminRoot,
      options.httpNodeRoot,
    ];

    app.set('originUrl', options.url);
    app.set('url', options.url);
    app.set('host', options.host);
    app.set('port', options.port);

    app.use('/', unless(routes, `${options.httpNodeRoot}/${options.uiPath}`));

    if (options.tunnel) {
      await tunnel.init(app, options);
    }
    await nodeRed.init(app, options);

    return await start(options);
  } catch (error) {
    console.log('server', 'init:err', error);
    throw error;
  }
};
