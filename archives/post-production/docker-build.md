## Update Soon...

## Guide on optimizing docker build

<!-- ```Dockerfile
FROM node:alpine3.21

WORKDIR /app/inx/inx-srvc

ENV DB_CONNECTION_URL="mongodb://admin:adminInxPass@inx-srvc-database:27017/?authSource=admin"
ENV DB_NAME=insightxCaLocal
ENV PORT=3001

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

CMD ["pnpm", "run", "start"]
``` -->
