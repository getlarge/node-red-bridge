const RED = require('node-red');
const http = require('http');

const nodeRed = {};

nodeRed.init = (app, conf) => {
  // Add a simple route for static content served from 'public'
  //  app.use('/', express.static('public'));
  const server = http.createServer(app);
  let port = conf.port || 8000;
  let userDir = conf.userDir || '/home/ed/Aloes/virtual-object-flow/';
  const settings = {
    httpAdminRoot: conf.httpAdminRoot || '/red',
    httpNodeRoot: conf.httpNodeRoot || '/api',
    userDir: userDir,
    nodesDir: conf.nodesDir || `${userDir}.config.json`,
    functionGlobalContext: {}, // enables global context
    flowFile: conf.flowFile || `${userDir}flows.json`,
    flowFilePretty: true,
    //  httpNodeAuth: {user:"user",pass:"$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN."},
    //  httpStaticAuth: {user:"user",pass:"$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN."},
    //  httpNodeCors: {
    //    origin: "*",
    //    methods: "GET,PUT,POST,DELETE"
    //},
    //  disableEditor: false,
    // todo : Use passport middleware to validate requests.
    //  httpNodeMiddleware: function(req,res,next) {
    //   // Handle/reject the request, or pass it on to the http in node
    //   // by calling next();
    //   next();
    //},
  };

  if (conf.username !== null && conf.passHash !== null) {
    settings.adminAuth = {
      type: 'credentials',
      users: [
        {
          username: conf.username,
          password: conf.passHash,
          permissions: '*',
        },
      ],
    };
  }

  RED.init(server, settings);
  app.use(settings.httpAdminRoot, RED.httpAdmin);
  app.use(settings.httpNodeRoot, RED.httpNode);
  server.listen(port);
  //  RED.runtime.start();
  RED.start();

  console.log(
    'nodered',
    'init',
    `${conf.name || 'Node-red'} admin listening @: ${port}${
      settings.httpAdminRoot
    }`,
  );
  console.log(
    'nodered',
    'init',
    `${conf.name || 'Node-red'} node listening @: ${port}${
      settings.httpNodeRoot
    }`,
  );

  return server;
};

nodeRed.isStarted = async () => {
  const started = await RED.runtime.isStarted();
  console.log('nodered', 'is started ?', `${started}`);
  if (!!started) {
    return true;
    //  await RED.start();
  }
  return false;
};

nodeRed.start = async () => {
  if (!(await nodeRed.isStarted())) {
    console.log('start nodes', RED.nodes);
    await RED.start();
  }
  return true;
};

nodeRed.stop = async () => {
  if (await nodeRed.isStarted()) {
    await RED.runtime.stop();
    await RED.stop();
    //  console.log('end nodes', RED.nodes);
  }
  return true;
};

module.exports = nodeRed;
