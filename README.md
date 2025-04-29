# InsightX Service

_Backend service for project **InsightX**, a platform where users can sign in and share their thoughts on any topic of their choice, allowing others to express their opinions and engage in discussions._

#### Release Guide:

1. [Release v1.0](https://github.com/sayyammshah/inx-service-ca/releases/tag/v1.0) - 21st March 2025 **_( latest )_**

### Badges

[![Static Code CI](https://github.com/sayyammshah/inx-service-ca/actions/workflows/checks.yaml/badge.svg)](https://github.com/sayyammshah/inx-service-ca/actions/workflows/checks.yaml)

[![Build and Publish a container](https://github.com/sayyammshah/inx-service-ca/actions/workflows/publish.yaml/badge.svg)](https://github.com/sayyammshah/inx-service-ca/actions/workflows/publish.yaml)

---

### Local Setup

To get this project running locally, you can use docker container image or can clone repository.

#### 1. Docker container:

_Docker & Docker Compose should be installed on your system_

```bash
# Clone Compose file

git clone https://gist.github.com/e886139cda30a9bc66051dbaef505030.git inx

cd inx
```

```bash
# Create an .env file by copying this template modify the values or use it as is & Ensure the .env file is inside the inx directory.

NODE_ENV=development
PORT=3001

# Refer to all credentials present in compose file.
DB_CONNECTION_URL="mongodb://<username>:<password>@<database_service_name>:27017/?authSource=admin"
DB_NAME=insightxCaLocal

INX_IMAGE_TAG=1.0
```

```bash
# start your app in detached mode

docker compose -f inx-docker-compose.yaml up -d
```

_Note_:

- In this above env file `username` & `password` should be the one which has been configured while setting up database container service.
- and `database_service_name` should be the same name as of database container service

_That's all your app should be up and running_

#### 2. Clone repository

_NodeJs, pnpm & mongodb community server is required before you start setting up_

```bash
# Clone Repository

git clone https://github.com/sayyammshah/inx-service-ca.git
```

```bash
# Create an .env.local file by copying this template modify the values or use it as is.

NODE_ENV=development
PORT=3001

DB_CONNECTION_URL="mongodb://localhost:27017/"
DB_NAME=insightxCaLocal

# Optional in case you don't want to build image locally
INX_IMAGE_TAG=1.0
```

```bash
# Install dependencies
pnpm install

# Start the application in development mode
pnpm run dev
```

---

### Extras

Note:

- _This is a self-driven project to explore techonologies and understand the different phases of software development._

Engineering Notes:

- [Pre-Production](engineering-notes/pre-production/)
- [Production](engineering-notes/production/)
- [Post-Production](engineering-notes/post-production/)

Resources:

- Container image for this project is available [here.](https://github.com/sayyammshah/inx-service-ca/pkgs/container/inx-service-ca)
- Docker-compose file is available [here.](https://gist.github.com/e886139cda30a9bc66051dbaef505030.git)
- View collection [here.](https://www.postman.com/red-trinity-198591/api-box/collection/zupxh38/inx-service-ca)

  OR

  [<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/17286362-d4ffe187-b2fd-4207-bee2-f7a9800f2397?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D17286362-d4ffe187-b2fd-4207-bee2-f7a9800f2397%26entityType%3Dcollection%26workspaceId%3D555ae0bc-9f9b-4f70-a395-d0c7947b109e#?env%5BGlobal%5D=W3sia2V5IjoiQmFzZVVybCIsInZhbHVlIjoiaHR0cDovL2xvY2FsaG9zdDozMDAxIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImRlZmF1bHQiLCJzZXNzaW9uVmFsdWUiOiJodHRwOi8vbG9jYWxob3N0OjMwMDEiLCJjb21wbGV0ZVNlc3Npb25WYWx1ZSI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMSIsInNlc3Npb25JbmRleCI6MH1d)

---

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
