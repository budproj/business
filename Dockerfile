FROM node:16.16.0-alpine3.15 AS build

ARG GITHUB_TOKEN

ENV NODE_ENV="development"

WORKDIR /build

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./.npmrc ./
COPY ./bin ./bin

RUN npm i --ignore-scripts

COPY . ./

RUN npm run build

FROM node:16.16.0-alpine3.15 AS final

ENV NODE_ENV="production"

WORKDIR /usr/app

COPY --from=build /build/package.json ./
COPY --from=build /build/package-lock.json ./
COPY --from=build /build/dist dist

RUN npm i --ignore=dev --ignore-scripts

CMD [ "npm", "run", "start:prod" ]
