FROM node:18-buster

# Create app directory
RUN apt update -y
RUN apt install htop -y

WORKDIR /workdir
RUN npm i -g nodemon

COPY package*.json ./

RUN npm install

RUN npm ci --omit=dev

COPY . .

ENV PORT=31100
EXPOSE 31100
CMD [ "nodemon", "index.js" ]