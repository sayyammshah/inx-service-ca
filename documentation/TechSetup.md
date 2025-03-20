# Project Setup

# Pre-requisites

### Express Setup

| Package                | Version   | Type    | Description                                                                                                       |
| ---------------------- | --------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| express                | `4.21.2`  | Dep     | Core framework for building your API, handling routes, and middleware                                             |
| cors                   | `2.8.5`   | Dep     | Middleware to enable Cross-Origin Resource Sharing, allowing your API to be accessed from different domains.      |
| mongodb                | `6.13.1`  | Dep     | The official MongoDB driver for Node.js, essential for connecting to and interacting with your MongoDB database.  |
| pino                   | `9.6.0`   | Dep     | Logging library                                                                                                   |
| pino-http              | `10.4.0`  | Dep     | HTTP Logging library                                                                                              |
| pino-pretty            | `13.0.0`  | Dep     | Modifies JSON                                                                                                     |
| typescript             | `5.7.3`   | Dev Dep | Adds static typing to JavaScript, improving code safety and maintainability in your Express project.              |
| @types/node            | `22.13.2` | Dev Dep | Type definitions for Node.js, enabling TypeScript to understand Node’s built-in modules and APIs.                 |
| @types/express         | `5.0.0`   | Dev Dep | Type definitions for Express, ensuring TypeScript recognizes Express types like Request and Response.             |
| tsc-alias              | `1.8.10`  | Dev Dep | Resolves TypeScript path aliases during compilation for consistent imports.                                       |
| @types/cors            | `2.8.17`  | Dev Dep | Type definitions for the cors package, providing TypeScript support for CORS middleware configuration.            |
| @types/cors            | `2.8.17`  | Dev Dep | Type definitions for the cors package, providing TypeScript support for CORS middleware configuration.            |
| ---------------------- | --------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| eslint                 | `9.20.1`  | Dev Dep | A static analysis tool to enforce coding standards and catch potential errors in your JavaScript/TypeScript code. |
| eslint/js              | `9.20.0`  | Dev Dep | Core JavaScript rules for ESLint, providing foundational linting capabilities for your project.                   |
| eslint-config-prettier | `10.0.1`  | Dev Dep | Disables ESLint rules that conflict with Prettier, ensuring seamless integration of linting and formatting.       |
| eslint-plugin-prettier | `5.2.3`   | Dev Dep | Runs Prettier as an ESLint rule, enforcing consistent code formatting within your linting workflow.               |
| typescript-eslint      | `8.24.0`  | Dev Dep | ESLint parser and rules for TypeScript, enabling linting of TypeScript-specific syntax and patterns.              |
| globals                | `15.15.0` | Dev Dep | Defines global variables (e.g., process) for ESLint, preventing false "undefined" errors in TypeScript.           |
| prettier               | `3.5.1`   | Dev Dep | Code formatter that ensures uniform code style across your project’s TypeScript files.                            |

1. Package manager - pnpm
   - why? because it's fast, npm alike and dev friendly
2. Dependencies - [Refer this](Prerequisites.md)
3. Scripts
   - not using ts-node as it does not supports esm modules. Used tsx instead - [Reference](https://typestrong.org/ts-node/docs/imports#native-ecmascript-modules)
4. Instead of nodemon I have used native flag `--watch`

# DATABASE DESIGN

- Referenced based:
  - To maintain the flat document structure, referenced based pattern is used.

### Anatomy of Threads

#### Threads Hierarchy

- Top-level Thread:
  - depth: 0
  - parentThread: null
  - rootThread: null
- First level reply:
  - depth: 1
  - parentThread: {topLevelThreadId}
  - rootThread: {topLevelThreadId}
- Nested reply:
  - depth: 2
  - parentThread: {firstLevelReplyThreadId}
  - rootThread: {topLevelThreadId}

#### Notes

- Maximum allowed depth (phase 1) is 2 that is nesting is allowed upto 2 levels down
- thread → reply → reply-to-reply

### Post Development

- CI Setup, for static code checks
- CD setup, for package publishing on github container registry
- Implemented docker to build containers
