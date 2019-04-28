# Node-red-bridge

Node-RED project running in local mode, served by Express

## Settings
Use settings.js for regular start ( with node-red commands ).
Use lib/node-setup.js and deploy/ for express wrapping.

To generate a new password, use this command : 

```bash
node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 8));" your-password-here
```
And copy generated password into settings.js, or deploy/.env files coresponding to your NODE_ENV.

## Usage

```
git clone https://framagit.org/getlarge/node-red-bridge.git 
npm install
```

## Starting with Node-red CLI

When running multiple instances in parallel, you can specify a port:

```
npm run start -- -p 1885
```
To run a specific flow file:

```
npm run start -- testFlow.json
```

## Starting with Nodemon

To run via Express ( create .env file first using .env.sample as model ):

```
npm run start:dev
```

## Starting with PM2

```
npm install -g pm2
```

Edit node-red-bridge.json, then

```
npm run start:local
```

If you want to autorestart node-red

```
pm2 save
pm2 startup
```

