FROM node:20.7.0-alpine3.17

WORKDIR /usr/app
COPY ./ /usr/app
# RUN apk upgrade --no-cache
# RUN apk update
RUN npm install -g @angular/cli
RUN npm install
RUN echo "Configuring from main branch"
RUN npm run buildPreprod
RUN npm install -g http-server
EXPOSE 4200
CMD ["http-server", "dist/fds-hello-world-frontend/browser", "-p", "4200", "--host", "0.0.0.0"]
