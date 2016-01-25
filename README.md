# Sequelize wrapper for Relay and GraphQL.js

This is a library to allow the easy creation of Relay-compliant servers using
 [sequelize](https://github.com/sequelize/sequelize),
 [graphql-js](https://github.com/graphql/graphql-js) and
 [graphql-relay-js](https://github.com/graphql/graphql-relay-js).

[![npm](https://img.shields.io/npm/v/sequelize-relay.svg)](https://www.npmjs.com/package/sequelize-relay)
[![Travis](https://img.shields.io/travis/MattMcFarland/sequelize-relay.svg)](https://travis-ci.org/MattMcFarland/sequelize-relay)
[![Coverage Status](https://coveralls.io/repos/MattMcFarland/sequelize-relay/badge.svg?branch=master&service=github)](https://coveralls.io/github/MattMcFarland/sequelize-relay?branch=master)

## Documentation

For a comprehensive walk-through and more details [see the docs](https://mattmcfarland.gitbooks.io/sequelize-relay/content/index.html)

## Dependencies:
- [sequelize](https://github.com/sequelize/sequelize) -
 an easy-to-use multi sql dialect ORM for Node.js & io.js.
 It currently supports MySQL, MariaDB, SQLite, PostgreSQL and MSSQL.
- [graphql-relay-js](https://github.com/graphql/graphql-relay-js) -
 A library to help construct a graphql-js server supporting react-relay.
- [graphql-js](https://github.com/graphql/graphql-js) -
 A reference implementation of GraphQL for JavaScript.

## Getting Started


This library is designed to work with the
[graphql-relay-js](https://github.com/graphql/graphql-relay-js) implementation
of a GraphQL server using [Sequelize](https://github.com/sequelize/sequelize).

Consider reviewing the documentation and tests found at [graphql-relay-js](https://github.com/graphql/graphql-relay-js)
along with the [tests](src/data/__tests__) and documentation found [here](https://mattmcfarland.gitbooks.io/sequelize-relay/content/index.html).

## Using Sequelize Relay Library for GraphQL.js

Install Relay Library for GraphQL.js

```sh
npm install sequelize-relay
```

When building a schema for [GraphQL.js](https://github.com/graphql/graphql-js),
the provided library functions can be used to simplify the creation of Relay
patterns hand-in-hand with sequalize and graphql-relay:

* [getArrayData](getArrayData.md) - Converts an `Array` of <SequelizeModel> instances to an `Array` of <Attributes> objects.
* [resolveArrayByClass](resolveArrayByClass.md) - First, it internally resolves an an `Array` of <SequelizeModel> instances that are of the passed-in `SequelizeClass`. Then it converts the array into a **promised** `Array` of <Attributes> objects.
* [resolveArrayData](resolveArrayData.md) - Converts a **promised** `Array` of <SequelizeModel> instances into a **promised** `Array` of <Attributes> objects.

* NEW! - Sequelize Queries are available as an argument:

```
    articles: {
      description: 'Articles',
      type: articleConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(
          resolveModelsByClass(Article, { order: args.order}), args
        )
    },
```

[More methods here](https://mattmcfarland.gitbooks.io/sequelize-relay/content/docs/methods/SUMMARY.html)


## Contributing

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

### Running seeder:

Seeder is used to generate db.development.sqlite, which is then manually
copied to db.fixture.sqlite for unit tests. if db changes unit tests have
to changes, so it makes more sense to just have a fixed db.

```
npm run seed
```


But db is subject to change, so keeping the seeding feature in for now.
