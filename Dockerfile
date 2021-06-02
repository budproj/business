FROM node:15.5.1-alpine3.10

USER root

ENV NODE_ENV="production"

WORKDIR /usr/app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY dist dist

CMD [ "npm", "start" ]
