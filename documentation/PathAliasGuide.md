# Path Alias

### Description:

When we have long paths like `./core/business/entityManager/insights.js` in this case to make code more readable and maintainable we can implement Path alias

### Setup Path Alias

- Install dependencies listed in prerequisites file under `ESLint` heading.
- Configure tsconfig.json with following configuration

```json
// tsconfig.json
// under CompilerOptions

"baseUrl": "<Base Path of your directory eg. ./src in this case>",
"paths": {
    "@<alias_name>": ["<path to that respective file/folder>"]
}

```

- Configure ESLint configurations to display error on relative imports

```js
// eslint.config.js
// under rules
"no-restricted-imports":[
    '<replace with type eg. error | warn | info>',
    {
        patterns: [
            {
              group: ["<Relative Path to you're folder>"],
              message:
                "<Custom Message to show on error>",
            }
          ],
    }
]

```

- Now this will work well in dev mode but when it will throw errors when you try to create production build.
- To resolve that install `tsc-alias` package which will resolve all you're aliases at build time

---

### References

- [Configure Path Alias](https://webreaper.dev/posts/tsconfig-paths-setup/)
- [`tsc-alias`](https://github.com/justkey007/tsc-alias#readme)
- [`no-restriced-imports`](https://eslint.org/docs/latest/rules/no-restricted-imports)
