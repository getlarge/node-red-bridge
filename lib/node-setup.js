import bcrypt from 'bcryptjs';
import basicAuth from 'express-basic-auth';
import session from 'express-session';
import http from 'http';
import RED from 'node-red';
import externalModules from './external-modules';

let users = {};
let httpServer;
const nodeRed = {};
nodeRed.isLoggedIn = false;

nodeRed.isStarted = async () => {
  const started = await RED.runtime.isStarted();
  console.log('nodered', 'is started ?', `${started}`);
  return !!started;
};

nodeRed.start = async (conf) => {
  try {
    nodeRed.isLoggedIn = true;
    if (!(await nodeRed.isStarted())) {
      await RED.start();
    }

    console.log(
      'nodered',
      `${conf.name || 'Node-red'} admin listening @: ${conf.port}${conf.httpAdminRoot}
      node listening @: ${conf.port}${conf.httpNodeRoot}
      access UI from ${conf.httpNodeRoot}/${conf.uiPath}`,
    );
    return httpServer;
  } catch (error) {
    console.log('nodered', 'start:err', error);
    nodeRed.isLoggedIn = false;
    return false;
  }
};

nodeRed.stop = async () => {
  try {
    console.log('nodered', 'stop');
    await RED.runtime.stop();
    httpServer.close();
    return true;
  } catch (error) {
    console.log('nodered', 'stop:err', error);
    throw error;
  }
};

nodeRed.init = async (app, conf) => {
  try {
    console.log('nodered', 'init');
    httpServer = http.createServer(app);

    let port = conf.port || 8000;
    let userDir = conf.userDir || './';
    const settings = {
      httpAdminRoot: conf.httpAdminRoot || '/red',
      httpNodeRoot: conf.httpNodeRoot || '/api',
      ui: { path: conf.uiPath || 'ui' },
      userDir,
      nodesDir: conf.nodesDir || `${userDir}.config.json`,
      flowFile: conf.flowFile || `${userDir}flows.json`,
      flowFilePretty: true,
      functionGlobalContext: {
        processEnv: process.env,
      },
      contextStorage: {
        default: conf.storeType || 'memoryOnly',
        memoryOnly: { module: 'memory' },
        file: { module: 'localfilesystem' },
      },
      //  disableEditor: false,
      paletteCategories: [
        'subflows',
        'aloes',
        'devices',
        'input',
        'output',
        'function',
        'social',
        'mobile',
        'storage',
        'analysis',
        'advanced',
      ],
    };

    const loadedModules = externalModules(conf);
    if (loadedModules && Object.keys(loadedModules).length > 0) {
      Object.keys(loadedModules).forEach(
        (key) => (settings.functionGlobalContext[key] = loadedModules[key]),
      );
    }

    const authorizer = async (username, password, cb) => {
      try {
        if (!username || !password) return cb(null, false);
        if (users && users[username]) {
          const userMatches = basicAuth.safeCompare(username, users[username].name);
          const passwordMatches = basicAuth.safeCompare(password, users[username].password);
          //  return userMatches & passwordMatches;
          return cb(null, userMatches & passwordMatches);
        }
        return cb(null, false);
      } catch (error) {
        console.log('authorizer error', error);
        return cb(error, false);
      }
    };

    const getUnauthorizedResponse = (req) => {
      //  console.log('getUnauthorizedResponse', req.session, req.auth);
      if (req.auth) {
        req.session.regenerate(() => {
          req.session.user = req.auth.user;
          req.session.success = `Authenticated as ${req.auth.user}`;
        });
      } else {
        req.session.error = 'Authentication failed, please check your username and password.';
      }
    };

    const restrict = (req, res, next) => {
      if (req.session.user) {
        next();
      } else {
        req.session.error = 'Access denied!';
        res.redirect(`login`);
      }
    };

    const authenticate = basicAuth({
      challenge: true,
      authorizer: authorizer,
      authorizeAsync: true,
      unauthorizedResponse: getUnauthorizedResponse,
    });

    if (conf.aloesEmail !== null && conf.aloesPassword !== null) {
      const adminPassHash = bcrypt.hashSync(conf.aloesPassword, 8);
      process.env.NODE_RED_ADMIN_PASSHASH = adminPassHash.toString();
      settings.adminAuth = {
        type: 'credentials',
        users: [
          {
            username: conf.aloesEmail,
            password: adminPassHash.toString(),
            permissions: '*',
          },
        ],
      };
    }

    if (conf.username && conf.username !== null && conf.userPass && conf.userPass !== null) {
      users[conf.username] = { name: conf.username, password: conf.userPass };
    }
    if (conf.credentialSecret !== null) {
      settings.credentialSecret = conf.credentialSecret;
    }
    await RED.init(httpServer, settings);

    app.use(
      settings.httpNodeRoot,
      session({
        name: conf.name,
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        secret: conf.sessionSecret,
        cookie: { maxAge: 60000 },
      }),
    );
    // app.use((req, res, next) => {
    //   var err = req.session.error;
    //   var msg = req.session.success;
    //   delete req.session.error;
    //   delete req.session.success;
    //   res.locals.message = '';
    //   if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    //   if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    //   next();
    // });

    if (conf.httpNodeAuth === 'basic') {
      app.use(settings.httpNodeRoot, authenticate);
    }
    app.use(settings.httpAdminRoot, RED.httpAdmin);
    app.use(settings.httpNodeRoot, RED.httpNode);
    httpServer.listen(port);
    return nodeRed.start(conf);
  } catch (error) {
    console.log('nodered', 'init:err', error);
    throw error;
  }
};

export default nodeRed;
