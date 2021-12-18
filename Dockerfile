FROM node:14

WORKDIR /app

COPY ["package.json","./"]

RUN npm i

RUN yarn add tailwindcss

RUN npm run build

COPY . .

EXPOSE 3000

CMD ["npm","start","build"]

