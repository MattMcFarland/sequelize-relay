## resolveArrayData ⇒ `Promise<Array<Attributes>>`
**resolveArrayData(`promisedInstances`, `withMethods`) ⇒ `Promise<Array<Attributes>>`**

Converts a **promised** `Array` of <SequelizeModel> instances into a **promised**
`Array` of <Attributes> objects.


**Returns**: Promise`<Array<`SequelizeModel`>>`


<table>
<thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td>promisedInstances</td><td>Promise<Array></td><td>A promise that will become an array of <SequelizeModel> instances</td></tr>
<tr><td>withMethods</td><td>Boolean <code>default: false</code></td><td>If true, the <Attributes> objects wil also contain the get/set methods from the <SequelizeModel></td></tr>
</tbody>
</table>

----


### Module Import
```javascript
    import { resovleArrayData } from 'sequelize-relay';
```

The `resolveArrayData` and [getArrayData](getArrayData.md) methods are very similar as they both return
an Array of Attributes objects.  The difference is that the `getArrayData` method expects an Attributes `Array`, and
`resolveArrayData` expects a **promised** Attributes `Array` instead.


### Examples

```javascript
var User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  lastName: {
    type: Sequelize.STRING
  }
});

User.sync({force: true}).then(function () {
  // Table created
  return User.create({
    firstName: 'John',
    lastName: 'Hancock'
  });
});
```

Now let's pretend we created 10 different Users and we wanted to retrieve a list of all 10, but only get their attributes.

```javascript
async function getUserList () {
  return await resolveArrayData(User.findAll());
} // => [{firstName: 'John' ...}, {...}]

```

Given the following sequelize Model:
```javascript
var Person = sequelize.define('Person', {
  ..., // shortended for brevity
}, {
  classMethods: {
    associate: (models) => {
      Person.hasMany(models.Article, {
        foreignKey: 'AuthorId'
      });
    }
  }
});
```
*For more information about how sequelize models work, [click here](http://docs.sequelizejs.com/en/latest/docs/models-definition/).*

If we call



Consider the following GraphQL Schema Type for `personType` (shortened for brevity):

```javascript


var personType = new GraphQLObjectType({
  fields: () => ({
    ...,
    articlesAuthored: {
      type: articleConnection,
      args: connectionArgs,
      resolve: (person, args) =>
        connectionFromPromisedArray(
          resolveArrayData(person.getArticles()), args
        )
    }
  })
});
```
*For more information about `connectionArgs` and `connectionFromPromisesdArray`, [click here](https://github.com/graphql/graphql-relay-js#connections).*

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