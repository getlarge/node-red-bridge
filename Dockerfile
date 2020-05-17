FROM node:lts-alpine
LABEL maintainer="getlarge <ed@getlarge.eu>"

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node package*.json ./
COPY --chown=node settings.js ./
COPY --chown=node .env ./
COPY --chown=node lib/ ./lib/

RUN npm install
RUN npm run build

VOLUME  "./deploy/:/deploy" 

CMD [ "node", "./dist/index.js"]
