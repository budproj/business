FROM node:15.5.1-alpine3.10 AS build

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

FROM node:15.5.1-alpine3.10 AS final

ENV NODE_ENV="production"

WORKDIR /usr/app

COPY --from=build /build/package.json ./
COPY --from=build /build/package-lock.json ./
COPY --from=build /build/dist dist

CMD [ "npm", "start:prod" ]
