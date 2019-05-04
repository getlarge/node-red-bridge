const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// The `https` setting requires the `fs` module. Uncomment the following
// to make it available:
//  const fs = require("fs");

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

const conf = {
  name: result.parsed.NODE_NAME,
  port: Number(result.parsed.NODE_RED_PORT),
  httpAdminRoot: result.parsed.NODE_RED_ADMIN_ROOT,
  httpNodeRoot: result.parsed.NODE_RED_API_ROOT,
  uiPath: result.parsed.NODE_RED_UI_PATH,
  username: result.parsed.NODE_RED_USERNAME || null,
  passHash: result.parsed.NODE_RED_PASSHASH || null,
  userDir: result.parsed.NODE_RED_USER_DIR,
  credentialSecret: result.parsed.NODE_RED_CREDENTIAL_SECRET || null,
  storeType: result.parsed.NODE_RED_STORE_TYPE,
  aloesEmail: result.parsed.ALOES_USER_EMAIL,
  aloesPassword: result.parsed.ALOES_USER_PASSWORD,
  aloesHost: result.parsed.ALOES_HTTP_HOST,
  aloesPort: Number(result.parsed.ALOES_HTTP_PORT),
  tunnel: result.parsed.TUNNEL_URL,
};
let port = conf.port || 1880;
let userDir = conf.userDir || './';
if (!conf.aloesPassword) {
  conf.aloesPassword = 'test';
}
const adminPassHash = bcrypt.hashSync(conf.aloesPassword, 8);
process.env.NODE_RED_ADMIN_PASSHASH = adminPassHash.toString();

module.exports = {
  // the tcp port that the Node-RED web server is listening on
  uiPort: port,

  // By default, the Node-RED UI accepts connections on all IPv4 interfaces.
  // The following property can be used to listen on a specific interface. For
  // example, the following would only allow connections from the local machine.
  //uiHost: "127.0.0.1",

  // Retry time in milliseconds for MQTT connections
  mqttReconnectTime: 15000,

  // Retry time in milliseconds for Serial port connections
  serialReconnectTime: 15000,

  // Retry time in milliseconds for TCP socket connections
  //socketReconnectTime: 10000,

  // Timeout in milliseconds for TCP server socket connections
  //  defaults to no timeout
  //socketTimeout: 120000,

  // The maximum length, in characters, of any message sent to the debug sidebar tab
  debugMaxLength: 1000,
  httpAdminRoot: conf.httpAdminRoot || '/red',
  httpNodeRoot: conf.httpNodeRoot || '/api',
  ui: { path: conf.uiPath || 'ui' },
  userDir,
  nodesDir: conf.nodesDir || `${userDir}.config.json`,
  flowFile: conf.flowFile || `${userDir}flows.json`,
  flowFilePretty: true,
  // The following property can be used in place of 'httpAdminRoot' and 'httpNodeRoot',
  // to apply the same root to both parts.
  //httpRoot: '/red',

  // When httpAdminRoot is used to move the UI to a different root path, the
  // following property can be used to identify a directory of static content
  // that should be served at http://localhost:1880/.
  //httpStatic: './static',

  // Securing Node-RED
  // -----------------
  // To password protect the Node-RED editor and admin API, the following
  // property can be used. See http://nodered.org/docs/security.html for details.
  adminAuth: {
    type: 'credentials',
    users: [
      {
        username: conf.aloesEmail,
        password: adminPassHash.toString(),
        permissions: '*',
      },
    ],
  },

  // To password protect the node-defined HTTP endpoints (httpNodeRoot), or
  // the static content (httpStatic), the following properties can be used.
  // The pass field is a bcrypt hash of the password.
  // See http://nodered.org/docs/security.html#generating-the-password-hash
  httpNodeAuth: {
    user: 'test',
    pass: '2a$08$XU.UmQtnB/1jeWNHVybxsOVWywi9cLSu36p91WE.78AZzIWuQ73/K.',
  },
  //httpStaticAuth: {user:"user",pass:"$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN."},

  // The following property can be used to enable HTTPS
  // See http://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
  // for details on its contents.
  // See the comment at the top of this file on how to load the `fs` module used by
  // this setting.
  //
  //https: {
  //    key: fs.readFileSync('privatekey.pem'),
  //    cert: fs.readFileSync('certificate.pem')
  //},

  // The following property can be used to disable the editor. The admin API
  // is not affected by this option. To disable both the editor and the admin
  // API, use either the httpRoot or httpAdminRoot properties
  //disableEditor: false,

  // The following property can be used to configure cross-origin resource sharing
  // in the HTTP nodes.
  // See https://github.com/troygoode/node-cors#configuration-options for
  // details on its contents. The following is a basic permissive set of options:
  //httpNodeCors: {
  //    origin: "*",
  //    methods: "GET,PUT,POST,DELETE"
  //},

  // If you need to set an http proxy please set an environment variable
  // called http_proxy (or HTTP_PROXY) outside of Node-RED in the operating system.
  // For example - http_proxy=http://myproxy.com:8080
  // (Setting it here will have no effect)
  // You may also specify no_proxy (or NO_PROXY) to supply a comma separated
  // list of domains to not proxy, eg - no_proxy=.acme.co,.acme.co.uk

  // The following property can be used to add a custom middleware function
  // in front of all http in nodes. This allows custom authentication to be
  // applied to all http in nodes, or any other sort of common request processing.
  //httpNodeMiddleware: function(req,res,next) {
  //   // Handle/reject the request, or pass it on to the http in node
  //   // by calling next();
  //   next();
  //},
  functionGlobalContext: {
    aloesHandlers: require('aloes-handlers'),
    processEnv: process.env,
  },

  contextStorage: {
    default: conf.storeType || 'memoryOnly',
    memoryOnly: { module: 'memory' },
    file: { module: 'localfilesystem' },
  },

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

  // Configure the logging output
  logging: {
    // Only console logging is currently supported
    console: {
      // Level of logging to be recorded. Options are:
      // fatal - only those errors which make the application unusable should be recorded
      // error - record errors which are deemed fatal for a particular request + fatal errors
      // warn - record problems which are non fatal + errors + fatal errors
      // info - record information about the general running of the application + warn + error + fatal errors
      // debug - record information which is more verbose than info + info + warn + error + fatal errors
      // trace - record very detailed logging + debug + info + warn + error + fatal errors
      level: 'info',

      // Whether or not to include metric events in the log output
      metrics: false,
      // Whether or not to include audit events in the log output
      audit: false,
    },
  },
};
