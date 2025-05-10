FROM node:alpine
WORKDIR /src/app
COPY package.json .
RUN npm i
COPY . .
EXPOSE 9000
CMD ["npm", "start"]