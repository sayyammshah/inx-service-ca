# Inx Service Ca

_**inx**_ stands for InsightsX, _**ca**_ stands for Clean Architecture

### Badges

[![Create and publish a container](https://github.com/sayyammshah/inx-service-ca/actions/workflows/publish-pkg.yaml/badge.svg)](https://github.com/sayyammshah/inx-service-ca/actions/workflows/publish-pkg.yaml)

---

### About

_Backend service for project **InsightX**, a platform where users can sign in and share their thoughts on any topic of their choice, allowing others to express their opinions and engage in discussions._

#### Release Guide:

1. [Release v1.0](https://github.com/sayyammshah/inx-service-ca/releases/tag/v1.0) - 21st March 2025 **_( latest )_**

---

### Setup

To get this project running locally, you can use docker container image or can clone repository.

#### 1. Docker container:

- Prerequisites:
  - Docker
- Setup:

  <!-- - Clone [Docker-Compose](https://gist.github.com/e886139cda30a9bc66051dbaef505030.git) file using command: -->

  - Clone Docker Compose file using command:

    ```bash
      # clone docker compose file from github gist
      git clone https://gist.github.com/e886139cda30a9bc66051dbaef505030.git inx

      # change directory to inx
      cd inx
    ```

  - Create an `.env` file by copying this template modify the values or use it as is.
  - Ensure the `.env` file is inside the `inx` folder created in previous step.

    ```bash
      NODE_ENV=development
      PORT=3001
      DB_CONNECTION_URL=mongodb://mongo:27017/ # or it to a hosted MongoDB connection URL.
      DB_NAME=insightxDb
    ```

  - Run this command after completing the above steps to start your app.

    ```bash
      docker compose -f inx-docker-compose.yaml up
    ```

_That's all your app should be up and running_

#### 2. Clone repository

- Prerequisites

  - nodejs
  - pnpm
  - mongodb community-server

  ```bash
    git clone https://github.com/sayyammshah/inx-service-ca.git
  ```

- Copy the template above to create an `.env` file, then modify the values or use it as is.
- Install dependencies

  ```bash
    pnpm install
  ```

- Start the application in development mode

  ```bash
    pnpm run dev
  ```

---

### Extras

Note:

- _This is a self-driven project to explore techonologies and understand the different phases of software development._

Resources:

- Container image for this project is available [here.]([https://github.com/sayyammshah/inx-service-ca/pkgs/container/inx-service-ca])
- Docker-compose file is available [here.](https://gist.github.com/e886139cda30a9bc66051dbaef505030.git)

---

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
