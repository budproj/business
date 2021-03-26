FROM node:15.5.1-alpine3.10

ENV NODE_ENV="production"

WORKDIR /usr/app

COPY package.json ./
COPY package-lock.json ./
COPY scripts scripts
RUN chmod +x scripts/postinstall.sh
RUN npm install

COPY dist dist

CMD [ "npm", "start" ]
