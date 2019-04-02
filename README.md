# node-red-bridge

Node-RED project running in local mode, served by Express

## Usage

```
git clone https://github.com/getlarge/node-red-bridge.git 
npm install
npm start
```

When running multiple instances in parallel, you can specify a port:

```
npm start -- -p 1885
```
To run a specific flow file:

```
npm start -- testFlow.json
```


To run via Express ( ccreate .env file first ):

```
npm run start:dev
```

## Starting with PM2

```
npm install -g pm2
```

Edit node-red-bridge.json, then

```
pm2 start node-red-bridge.json
```

If you want autorestart

```
pm2 save
pm2 startup
```

