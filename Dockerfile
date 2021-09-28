FROM node:current-bullseye-slim AS build
# RUN apt-get update || : && apt-get install python -y
RUN apt-get update && \ 
    apt-get install -y build-essential \
    wget \
    python3 \
    make \
    gcc \ 
    libc6-dev 
WORKDIR /app
COPY . .

# RUN npm install @tensorflow/tfjs-node --ignore-scripts
# RUN npm rebuild @tensorflow/tfjs-node --build-from-source
RUN npm ci
RUN npm run build
RUN npm ci --production --no-audit

FROM node:current-bullseye-slim AS deploy
WORKDIR /app
COPY --from=build /app .

ENV PORT=3000
EXPOSE $PORT
CMD [ "node", "./build" ]