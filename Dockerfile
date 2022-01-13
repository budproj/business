FROM node:15.5.1-alpine3.10 AS build

ARG GITHUB_TOKEN

ENV NODE_ENV="development"

WORKDIR /build

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./.npmrc ./
COPY ./bin ./bin
RUN npm ci

COPY . ./

RUN npm run build

FROM node:15.5.1-alpine3.10 AS final

ENV NODE_ENV="production"

WORKDIR /usr/app

COPY --from=build /build/package.json ./
COPY --from=build /build/package-lock.json ./

RUN npm i next

COPY --from=build /build/dist dist
COPY --from=build /build/compiled-lang compiled-lang
COPY --from=build /build/public public
COPY --from=build /build/next.config.js .
COPY --from=build /build/.next .next

CMD [ "npm", "start" ]
