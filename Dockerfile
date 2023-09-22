FROM node:16.16.0-alpine3.15 AS build

ARG GITHUB_TOKEN

ENV NODE_ENV="development"

WORKDIR /build

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./.npmrc ./
COPY ./bin ./bin
COPY ./prisma ./prisma

RUN npm i --ignore-scripts

COPY . ./

RUN npx prisma generate
RUN npm run build

FROM node:16.16.0-alpine3.15 AS final

ENV NODE_ENV="production"

WORKDIR /usr/app

COPY --from=build /build/package.json ./
COPY --from=build /build/package-lock.json ./
COPY --from=build /build/dist dist
COPY --from=build /build/prisma prisma

RUN mkdir -p node_modules
COPY --from=build /build/node_modules/.prisma node_modules/.prisma

RUN npx prisma generate
RUN npm i --ignore=dev --ignore-scripts

CMD [ "npm", "run", "start:prod" ]
