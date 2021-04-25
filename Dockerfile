# stage 1
FROM node:14

WORKDIR /home

COPY ./interfaces ./interfaces/
COPY ./server ./server/

WORKDIR /home/server

RUN npm ci
RUN npm run build

# stage 2
FROM node:14

WORKDIR /home

COPY --from=0 /home/server/package*.json ./
COPY --from=0 /home/server/build/ .

RUN npm ci --only=production

EXPOSE 3000

CMD [ "node", "./index.js" ]