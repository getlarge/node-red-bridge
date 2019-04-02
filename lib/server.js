const express = require('express');
const dotenv = require('dotenv');
const nodeSetup = require('./lib/node-setup');
//  const nodemon = require('./index');

const app = express();

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

//  console.log('result', result);

// todo : add passport middleware for external auth via aloes

let httpServer;

app.use('/', express.static('public'));

app.set('url', result.parsed.HTTP_SERVER_URL);
app.set('host', result.parsed.HOST);
app.set('port', Number(result.parsed.PORT));

const scene1Conf = {
  name: result.parsed.NODE_NAME,
  httpAdminRoot: result.parsed.NODE_RED_ADMIN,
  httpNodeRoot: result.parsed.NODE_RED_API_ROOT,
  username: result.parsed.NODE_RED_USERNAME || null,
  passHash: result.parsed.NODE_RED_PASSHASH || null,
  userDir: result.parsed.NODE_RED_USER_DIR,
  //  port: Number(result.parsed.NODE_RED_PORT),
  port: Number(result.parsed.PORT),
};

app.start = () => {
  httpServer = nodeSetup.init(app, scene1Conf);
  app.emit('started');
};

app.on('started', () => {
  app.get(`${scene1Conf.httpNodeRoot}/start`, async (req, res) => {
    try {
      // todo : verify req.args.accessToken
      //  nodeSetup.init(app, scene1Conf);
      //  const state = await nodeSetup.start();
      if (!(await nodeSetup.isStarted())) {
        app.close();
        app.start();
      }
      return res.end();
    } catch (error) {
      console.log('nodered', 'start:err', error);
      return error;
    }
  });

  app.get(`${scene1Conf.httpNodeRoot}/stop`, async (req, res) => {
    try {
      // verify req.args.accessToken
      const state = await nodeSetup.stop();
      //  return state
      return res.end();
    } catch (error) {
      console.log('nodered', 'stop:err', error);
      return error;
    }
  });
});

app.close = function() {
  app.emit('closed');
  httpServer.close();
};

app.publish = (topic, payload) => {
  app.emit('publish', topic, payload);
};

app.start();

module.exports = app;
