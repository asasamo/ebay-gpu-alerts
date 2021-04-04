FROM node:current-alpine
WORKDIR /usr/src/app

ENV NODE_ENV production

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
