FROM node:lts-buster

WORKDIR /app

COPY . .

CMD "npm" "start"