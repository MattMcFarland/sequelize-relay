## resolveArrayData ⇒ `Promise<Array<Attributes>>`
**resolveArrayData(`Promise<Array<SequelizeModel>>`, `withMethods :Boolean=false`) ⇒ `Promise<Array<Attributes>>`**

Converts a **promised** `Array` of SequelizeModel instances into a **promised**
`Array` of Attributes objects.


**Returns**: `Promise<Array<SequelizeModel>>`


| Param           	 | Type      	| Description                           	                |
|------------------	 |-----------	|---------------------------------------	                |
| `promiseInstances` | `Promise` 	| A a **promised** `Array` of SequelizeModel instances    |
| `withMethods`    	 | `Boolean` 	| Populate Attributes objects with sequelize methods      |


----


### Module Import
```javascript
    import { resovleArrayData } from 'sequelize-relay';
```

### About

The `resolveArrayData` and [getArrayData](getArrayData.md) methods are very similar as they both return
an Array of Attributes objects.  The difference is that the `getArrayData` method expects an Attributes `Array`, and
`resolveArrayData` expects a **promised** Attributes `Array` instead.


### Examples

#### Example 1

```javascript
var User = sequelize.define('user', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING
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
import { Users } from 'myCoolDatabase';

async function getUserList () {
  return await resolveArrayData(Users.findAll());
} // => [{firstName: 'John' ...}, {...}]
```

#### Example 2

Given this [Person Model](../../sequelize/models/Person.js)
*For more information about how sequelize models work, [click here](http://docs.sequelizejs.com/en/latest/docs/models-definition/).*

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




#### More Examples

You can view more examples by reviewing the source code:

- Full [Person Model](../../sequelize/models/Person.js) Example from test source
- Full [GraphQL Setup](../../src/data/__tests__/connections.js) Example from test source
