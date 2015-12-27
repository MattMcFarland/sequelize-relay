# Sequelize wrapper for Relay and GraphQL.js

This is a library to allow the easy creation of Relay-compliant servers using
 [sequelize](https://github.com/sequelize/sequelize),
 [graphql-js](https://github.com/graphql/graphql-js) and
 [graphql-relay-js](https://github.com/graphql/graphql-relay-js).

[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/sequelize-relay)
[![Travis](https://img.shields.io/travis/rust-lang/rust.svg)](https://travis-ci.org/MattMcFarland/sequelize-relay)
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
patterns hand-in-hand with sequlize and graphql-relay.




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