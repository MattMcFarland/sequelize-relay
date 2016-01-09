# sequelize-relay
[![NPM](https://nodei.co/npm/sequelize-relay.png?compact=true)](https://nodei.co/npm/sequelize-relay/)

This is a library to allow the easy creation of Relay-compliant servers using
 [sequelize](https://github.com/sequelize/sequelize),
 [graphql-js](https://github.com/graphql/graphql-js) and
 [graphql-relay-js](https://github.com/graphql/graphql-relay-js).


<a href="https://github.com/MattMcFarland/sequelize-relay"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/365986a132ccd6a44c23a9169022c0b5c890c387/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f7265645f6161303030302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png"></a>

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


1. Setup a new npm project
2. Run `npm install graphql graphql-relay-js sequelize sequelize-relay --save-dev`
3. Setup a Sequelize Server
4. Setup your GraphQL Schema
5. Use graphql-relay-js, sequelize, and sequelize-relay helper functions and win.
6. Common Patterns, helper methods, etc in the References page.

## Methods

* [getArrayData](docs/methods/getArrayData.md) - Converts an `Array` of `<SequelizeModel>` instances to an `Array` of <Attributes> objects.

* [getModelsByClass](docs/methods/getModelsByClass.md) - Returns an `Array` of `<SequelizeModel>` instances that are of the passed-in `SequelizeClass`.

* [resolveArrayByClass](docs/methods/resolveArrayByClass.md) - First, it internally resolves an an `Array` of `<SequelizeModel>` instances that are of the passed-in `SequelizeClass`. Then it converts the array into a **promised** `Array` of `<Attributes>` objects.

* [resolveArrayData](docs/methods/resolveArrayData.md) - Converts a **promised** `Array` of `<SequelizeModel>` instances into a **promised** `Array` of `<Attributes>` objects.

* [resolveModelsByClass](docs/methods/resolveModelsByClass.md) - Returns a **promised** `Array` of `<SequelizeModel>` objects by `SequelizeClass`.

