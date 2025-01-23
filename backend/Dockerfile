# FROM harbor.xcr.svcs01.prod.us-east-1.kaas.sws.siemens.com/tools-images/node:20.15.1_alpine3.19.4_xcd2.4
FROM node:22-bullseye-slim

WORKDIR /usr/app
COPY ./ /usr/app
# RUN apk upgrade --no-cache
# RUN apk update
RUN npm install
RUN npm audit fix
EXPOSE 3000 
CMD ["node", "server.js"]