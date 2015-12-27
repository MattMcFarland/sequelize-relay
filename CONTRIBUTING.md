# Contributing

After cloning this repo, ensure dependencies are installed by running:

```sh
npm install
```

This library is written in ES6 and uses [Babel](http://babeljs.io/) for ES5
transpilation and [Flow](http://flowtype.org/) for type safety. Widely
consumable JavaScript can be produced by running:

```sh
npm run build
```

Once `npm run build` has run, you may `import` or `require()` directly from
node.

After developing, the full test suite can be evaluated by running:

```sh
npm test
```

While actively developing, we recommend running

```sh
npm run watch
```

in a terminal. This will watch the file system run lint, tests, and type
checking automatically whenever you save a js file.

To lint the JS files and run type interface checks run `npm run lint`.

## Running seeder:

Seeder is used to generate db.development.sqlite, which is then manually
copied to db.fixture.sqlite for unit tests. if db changes unit tests have
to changes, so it makes more sense to just have a fixed db.

```
npm run seed
```


But db is subject to change, so keeping the seeding feature in for now.