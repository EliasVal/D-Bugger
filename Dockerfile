FROM node:current-bullseye-slim AS build
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
RUN npm ci --production --no-audit

FROM node:current-bullseye-slim AS deploy
WORKDIR /app
COPY --from=build /app .

ENV PORT=3000
EXPOSE $PORT
CMD [ "node", "./build" ]