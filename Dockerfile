FROM node:18-alpine

# Create app directory
RUN apk update 

WORKDIR /workdir
RUN npm i -g pm2

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .
RUN cd client && npm ci --omit=dev && npm run build

COPY ecosystem.config.prod.js ecosystem.config.js
ENV PORT=31100
EXPOSE 31100
CMD [ "pm2-runtime", "ecosystem.config.js" ]
