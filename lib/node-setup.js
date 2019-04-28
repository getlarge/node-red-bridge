const RED = require('node-red');
const session = require('express-session');
const basicAuth = require('express-basic-auth');
const http = require('http');
const bcrypt = require('bcryptjs');

let users = {};
const nodeRed = {};
nodeRed.isLoggedIn = false;

nodeRed.login = (options, data) =>
  new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      console.log('LOGIN STATUS: ' + res.statusCode);
      //  console.log('HEADERS: ' + JSON.stringify(res.headers));
      const bodyChunks = [];
      res
        .on('data', chunk => {
          bodyChunks.push(chunk);
        })
        .on('end', () => {
          const body = Buffer.concat(bodyChunks);
          const token = JSON.parse(body);
          if (!token || !token.id) {
            resolve(false);
          }
          process.env.ALOES_TOKEN = token.id;
          resolve(token);
        });
    });

    req.on('error', e => {
      reject(e);
    });
    req.write(data);
    req.end();
  });

nodeRed.isStarted = async () => {
  try {
    const started = await RED.runtime.isStarted();
    console.log('nodered', 'is started ?', `${started}`);
    if (!!started) {
      return true;
    }
    return false;
  } catch (error) {
    return error;
  }
};

nodeRed.start = async conf => {
  try {
    const options = {
      host: conf.aloesHost,
      port: conf.aloesPort,
      path: '/api/users/login',
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    };
    const creds = JSON.stringify({
      email: conf.aloesEmail,
      password: conf.aloesPassword,
    });
    //  console.log('nodered', 'start', options);
    const token = await nodeRed.login(options, creds);
    if (token && !(await nodeRed.isStarted())) {
      nodeRed.isLoggedIn = true;
      await RED.start();
      return true;
    }
    nodeRed.isLoggedIn = false;
    return false;
  } catch (error) {
    nodeRed.isLoggedIn = false;
    return false;
  }
};

nodeRed.stop = async () => {
  try {
    if (await nodeRed.isStarted()) {
      await RED.runtime.stop();
    }
    return true;
  } catch (error) {
    return error;
  }
};

const authorizer = (username, password) => {
  //  console.log('authorizer', username, password);
  if (users && users.username) {
    const userMatches = basicAuth.safeCompare(username, users.username.name);
    const passwordMatches = basicAuth.safeCompare(password, users.username.password);
    return userMatches & passwordMatches;
  }
  return false;
};

const getUnauthorizedResponse = req => {
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
  //  authorizeAsync: true,
  unauthorizedResponse: getUnauthorizedResponse,
  //  realm: 'Imb4T3st4pp',
});

nodeRed.init = async (app, conf) => {
  try {
    const server = await http.createServer(app);
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
        aloesHandlers: require('aloes-handlers'),
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
      users.username = { name: conf.username, password: conf.userPass };
    }
    if (conf.credentialSecret !== null) {
      settings.credentialSecret = conf.credentialSecret;
    }

    await RED.init(server, settings);
    app.use(
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
    app.use(settings.httpNodeRoot, authenticate);
    app.use(settings.httpAdminRoot, RED.httpAdmin);
    app.use(settings.httpNodeRoot, RED.httpNode);

    server.listen(port);

    await nodeRed.start(conf);

    //  RED.httpNode.get([`/${conf.uiPath}`, `/${conf.uiPath}*`], authenticate, (req, res) => {
    //   res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
    // });

    // RED.httpNode.get(`logout`, (req, res) => {
    //   // destroy the user's session to log them out
    //   // will be re-created next request
    //   req.session.destroy(() => {
    //     res.redirect(`login`);
    //   });
    // });

    // RED.httpNode.get(`login`, (req, res) => {
    //   res.render('login');
    // });

    // RED.httpNode.post(`login`, (req, res, next) => {
    //   try {
    //     //  console.log('nodered', 'login:session', req.session);
    //     console.log('nodered', 'login:body', req.body);
    //     // authenticate(req.body.email, req.body.password)

    //     if (req.session.user) {
    //       next();
    //     } else {
    //       req.session.error = 'Access denied!';
    //       res.redirect(`${conf.httpNodeRoot}login`);
    //     }
    //     console.log('nodered', 'access_ui:session', req.session);
    //   } catch (error) {
    //     console.log('nodered', 'uiPath:err', error);
    //     return error;
    //   }
    // });

    if (!nodeRed.isLoggedIn) {
      throw new Error("can't login, try again ...");
    }
    console.log(
      'nodered',
      `${conf.name || 'Node-red'} admin listening @: ${port}${settings.httpAdminRoot}
      node listening @: ${port}${settings.httpNodeRoot}
      access UI from ${conf.httpNodeRoot}/${conf.uiPath}`,
    );
    return server;
  } catch (error) {
    return error;
  }
};

module.exports = nodeRed;
