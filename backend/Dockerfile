FROM node:20.7.0-alpine3.17

WORKDIR /usr/app
COPY ./ /usr/app
# RUN apk upgrade --no-cache
# RUN apk update
RUN npm install
RUN npm audit fix
EXPOSE 3000 
CMD ["node", "server.js"]