## getArrayData ⇒ `Array<Attributes>`
**getArrayData(`instances`, `withMethods`) ⇒ `Array<Attributes>`**

**Description:** Converts an `Array` of <SequelizeModel> instances to an `Array` of <Attributes> objects.


**Returns**: Array`<`Attributes`>`


<table>
<thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td>instances</td><td>Array</td><td>An array of <SequelizeModel> instances</td></tr>
<tr><td>withMethods</td><td>Boolean <code>default: false</code></td><td>If true, the <Attributes> objects wil also contain the get/set methods from the <SequelizeModel></td></tr>
</tbody>
</table>

----


### Module Import
```javascript
    import { getArrayData } from 'sequelize-relay';
```


The `getArrayData` and [resolveArrayData](resolveArrayData.md) methods are very similar as they both return
an Array of Attributes objects.  The difference is `resolveArrayData` expects a **promised**
Attributes `Array`, but the `getArrayData` method expects an Attributes `Array`.

Given the following sequelize Model:
```javascript
module.exports = function (sequelize, DataTypes) {

  var Person = sequelize.define('Person', {
    type: {...},
    givenName: {...},
    familyName: {...},
    address: {...}
  }, {
    classMethods: {
      associate: (models) => {
        Person.hasMany(models.Article, {
          foreignKey: 'AuthorId'
        });
      }
    }
  });
  return Person;
};
```
*For more information about how sequelize models work, [click here](http://docs.sequelizejs.com/en/latest/docs/models-definition/).*

> NOTE: Sequelize will automatically create helper functions and also pluralize person to people.

And consider the following GraphQL Schema Type for `personType`:

```javascript

var {connectionType: personConnection} =
  connectionDefinitions({nodeType: personType});

var personType = new GraphQLObjectType({
  name: 'Person',
  description: 'A Person',
  fields: () => ({
    id: globalIdField(),
    givenName: {...},
    familyName: {...},
    address: {...},
    articlesAuthored: {
      type: articleConnection,
      args: connectionArgs,
      resolve: (person, args) =>
        connectionFromPromisedArray(
          resolveArrayData(person.getArticles()), args
        )
    }
  }),
  interfaces: [nodeInterface]
});

```

`person.getArticles`, a sequelize method, will be passed in as our argument
to `resolveArrayData` - which will then in turn return a correctly
structured promise to `connectionFromPRomisedArray` which is a method
imported from thw `graphql-relay-js` library.

We are running our helper methods along with graphql-relay and graphql
libraries, the usage of `resolveArrayData` can be noted here:

```javascript
resolve: (person, args) =>
  connectionFromPromisedArray(
    resolveArrayData(person.getArticles()), args
  )
```

So when we run the following Relay style Query:

```
query PersonRefetchQuery {
  node(id: "UGVyc29uOjI=") {
    id
    ... on Person {
      id
      givenName
      familyName
      address
      articlesAuthored {
        edges {
          node {
            id
            headline
            thumbnailUrl
          }
        }
      }
    }
  }
```

We get:

```json
{
  "data": {
    "node": {
      "id": "UGVyc29uOjI=",
      "givenName": "Amir",
      "familyName": "Schmeler",
      "address": "197 Mina Gardens",
      "articlesAuthored": {
        "edges": [
          {
            "node": {
              "id": "QXJ0aWNsZToy",
              "headline": "Open-source object-oriented approach",
              "thumbnailUrl": "http://lorempixel.com/640/480/business"
            }
          }
        ]
      }
    }
  }
}
```