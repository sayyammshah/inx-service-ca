# Project Setup

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
