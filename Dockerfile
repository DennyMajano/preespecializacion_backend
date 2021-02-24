FROM node:14.15.4
RUN apt-get update --fix-missing
RUN apt-get install -f
RUN apt-get install -y software-properties-common
RUN apt-get install -y build-essential
RUN apt-get install -y python
RUN apt-get install -y libreoffice
RUN apt-get install -y unzip
RUN echo "deb http://httpredir.debian.org/debian jessie main contrib" > /etc/apt/sources.list
RUN echo "deb http://security.debian.org/ jessie/updates main contrib" >> /etc/apt/sources.list
RUN echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections
RUN apt-get update
RUN apt-get install -y ttf-mscorefonts-installer
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
RUN npm install && npm cache clean --force
WORKDIR /usr/local/share/fonts
RUN wget https://cdn.discordapp.com/attachments/728613589425848360/764158331064549436/fuentes.zip -O /usr/local/share/fonts/roboto.zip
RUN unzip /usr/local/share/fonts/roboto.zip
RUN fc-cache -f -v
WORKDIR /usr/src/app
RUN npm install pm2 -g
COPY ./ /usr/src/app
EXPOSE 80
CMD ["pm2-runtime","./bin/www"]