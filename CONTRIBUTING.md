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
