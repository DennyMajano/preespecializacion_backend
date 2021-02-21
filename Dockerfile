FROM node:14.15.4
RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y python
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
RUN npm install && npm cache clean --force
RUN npm install pm2 -g
COPY ./ /usr/src/app
EXPOSE 80
CMD ["pm2-runtime","./bin/www"]