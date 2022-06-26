# Another TODO list made with React


### Test it!

> This project has many integration tests, several e2e tests and a few unit tests

I suggest to run your test in a sqlite in memory database, for this you need to create a `.env.test` file with the following:

```
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
```

And with that you are ready to go and run some tests.

- To run e2e tests (with [Cypress](https://www.cypress.io/)) execute:
```bash
npm run cypress # or cypress:open
```

- To run integration tests (with [Japa](https://japa.dev/)) execute:
```bash
npm test
```

- And finally run run unit tests (using [vitest](https://vitest.dev/)) for the React components execute:
```bash
cd ./client
npm tests
```
