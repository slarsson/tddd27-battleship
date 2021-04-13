#
# TODO: fix this
#

FROM node:14

WORKDIR /home

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "./build/index.js" ]