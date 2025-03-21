# INX Service CA

InsightX is a platform where users can sign in and share their thoughts on any topic of their choice, allowing others to express their opinions and engage in discussions.

| Index                  | Description                                                                                                                         | Link                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Project Setup          | Step-by-step guide on setting up the project, including package manager usage, dependencies, and scripts.                           | [Project Setup](documentation/TechSetup.md)                     |
| Path Alias Guide       | Instructions on setting up path aliases to make the code more readable and maintainable.                                            | [Path Alias Guide](documentation/PathAliasGuide.md)             |
| Module Architecture    | Describes the architecture of the core, bindings, infrastructure, and shared modules, including their components and interactions.  | [Module Architecture](documentation/ModuleArchitecture.md)      |
| Models and Validations | Contains all the database models and validation rules, including relationships and foreign keys.                                    | [Models and Validations](documentation/ModelsAndValidations.md) |
| Business Rules         | Detailed documentation on the business rules applied within the project, including basic and advanced rules for insights and posts. | [Business Rules](documentation/BusinessRules.md)                |
| Thread Model Analysis  | Analysis of the thread model used in the project, including comment hierarchy and structure.                                        | [Thread Model Analysis](documentation/ThreadModelAnalysis.md)   |

## Setup

So to get this project running locally, you can use docker container image or can clone repo.

1. Docker container:

- Prereuisites:
  - MongoDB Community-Server
  - Docker
- Setup:
  - Clone [Docker-Compose](https://gist.github.com/e886139cda30a9bc66051dbaef505030.git) file using command:
  ```bash
      $ git clone https://gist.github.com/e886139cda30a9bc66051dbaef505030.git
  ```
  - Create env file by copying this content and replace with you're own values
  ```env
    NODE_ENV=development
    PORT=3001
    DB_CONNECTION_URL=<MONGODB_URI>
    DB_NAME=<DATABASE_NAME>
  ```
  - After above listed steps run this command to get your app up and running
  ```bash
    $ docker compose -f inx-docker-compose.yaml up
  ```
  _That's all your app should be up and running_

2. Clone repository

- Prerequisites
  - pnpm
  - mongodb community-server
  - nodejs
- Or else you can clone the repository

```bash
    $ git clone https://github.com/sayyammshah/inx-service-ca.git
```

- Copy env file from previous option and replace with your own values.
- Install all dependencies

```bash
    $ pnpm install
```

- Start the application in development mode

```bash
    $ pnpm run dev
```

Note: Container image for this project is available at [GHCR]([https://github.com/sayyammshah/inx-service-ca/pkgs/container/inx-service-ca])
