# stage 1: build
FROM node:12.18.3-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --only=prod
COPY . .

EXPOSE 3000

CMD ["npm", "start"]