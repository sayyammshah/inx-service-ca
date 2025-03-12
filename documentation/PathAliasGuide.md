# Path Alias

### Description:

When we have long paths like `./core/business/entityManager/insights.js` in this case to make code more readable and maintainable we can implement Path alias

### Setup Path Alias

1. Configure tsconfig.json with following configuration

```json
// tsconfig.json
// under CompilerOptions

"baseUrl": "<Base Path of your directory eg. ./src in this case>",
"paths": {
    "@<alias_name>": ["<path to that respective file/folder>"]
}

```

2. Configure `.vscode/settings.json` with `"typescript.preferences.importModuleSpecifier": "shortest"`

   - This will help to keep import paths shorter w.r.t which forder your in.

3. Setup Aliases resolver

   - Now this will work well in dev mode but it will throw errors when you try to create build.
   - To resolve that install `tsc-alias` package which will resolve all you're aliases at build time.

### Optional

- If you prefer to show error on not using alias import configure ESLint configurations to display error on relative imports

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

---

### References

- [Configure Path Alias](https://webreaper.dev/posts/tsconfig-paths-setup/)
- [`tsc-alias`](https://github.com/justkey007/tsc-alias#readme)
- [`no-restriced-imports`](https://eslint.org/docs/latest/rules/no-restricted-imports)
