# Github Workflow Guide

## CI

- Static code checking
  - Prettier formatting
  - linting

## CD

- Authenticate with github container registry
- Build docker image
- Push the docker image
- publish the docker image to ghcr.io

**Format of URL**

- ghcr.io/NAMESPACE/IMAGE_NAME:latest
- ghcr.io/sayyammshah/{repositoryName}:{version}
