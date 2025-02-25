# Project Setup

1. Package manager used - pnpm
   - why? because fast, npm alike and dev friendly
2. Installed dependencies -
   - express
   - DevDeps: @types/express typescript @types/node
3. Scripts - not using ts-node as it does nto supports esm modules used tsx instead
4. Instead of nodemon I have used native flag --watch

DATABASE DESIGN -

- Impleted Referenced Based and Embedded pattern in models of insights
  - referenced based because to avoid data key reduncy
  - embedded because to improve performance lag cause due to referenced based approach

Comment Hierarchy Structure - - Top-level comments: depth: 0, parentCommentId: null - First reply: depth: 1, points to parentCommentId of depth 0 - Second reply: depth: 2, points to parentCommentId of depth 1 - Maximum depth: 2 (3 levels total: comment → reply → reply-to-reply)
