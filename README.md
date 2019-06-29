# Node-red-bridge

Node-RED running in local mode, served by Express.

- Custom authentification schemes, using Aloes backend ( [device-manager](https://framagit.org/aloes/device-manager.git) ). 

- Contains subflows to quickly connect to Aloes API.

- Fast interface prototyping to validate concepts.

- Edit scenarios to create interactions chains with your device.



## Settings

### Required : 
- Use settings.js for Node-red standalone start ( with node-red commands ).
- Use lib/node-setup.js and deploy/ when embedding in express application.


### Optionals :

- If you don't have any device yet, you can setup your own with [Gateway Manager](https://framagit.org/aloes/gatewaymanager.git) for Arduino, or [node-red-device](https://framagit.org/getlarge/node-red-device.git) for any Linux device.

- Register a new device with [Aloes Client](https://framagit.org/aloes/aloes-client.git)

- To generate a new password, use this command : 

```bash
node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 8));" your-password-here
```

And copy generated password into settings.js, or deploy/.env files coresponding to your NODE_ENV.


## Usage

```bash
git clone https://framagit.org/aloes/node-red-bridge.git 
npm install
```

### Starting with Node-red CLI

When running multiple instances in parallel, you can specify a port:

```bash
npm run start -- -p 1885
```
To run a specific flow file:

```bash
npm run start -- testFlow.json
```

### Starting with Nodemon

To run via Express ( create .env file first using .env.sample as model ):

```bash
npm run start:dev
```

### Starting with PM2

```bash
npm install -g pm2
```

Create deploy/.env_ files coresponding to your NODE_ENV. ( .env_local for NODE_ENV=local ).

Edit ecosystem.config.js, then

```bash
npm run start:local
```

If you want to autorestart node-red

```bash
pm2 startup
pm2 save
```

