FROM node:18-alpine

# Create app directory
RUN apk update 

WORKDIR /workdir
RUN npm i -g nodemon

COPY package*.json ./

RUN npm install

RUN npm ci --omit=dev

COPY . .

ENV PORT=31100
EXPOSE 31100
CMD [ "nodemon", "index.js" ]