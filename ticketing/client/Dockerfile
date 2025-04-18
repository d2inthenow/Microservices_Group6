# client/Dockerfile
FROM node:alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build  # 🔧 build trước khi start

CMD ["npm", "start"]  # 🔧 start ở chế độ production
