FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -- --configuration production

RUN npm install -g serve

EXPOSE 12000

CMD ["serve", "-s", "dist/scoring-management-systems/browser", "-l", "12000"]