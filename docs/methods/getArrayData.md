## getArrayData ⇒ `Array<Attributes>`

**getArrayData(`Array<SequelizeModel>`, `withMethods :Boolean = false`) ⇒ `Array<Attributes>`**

**Description:** Convert `Array` of SequelizeModel instances to `Array` of Attributes objects.

**Returns**: `Array<Attributes>`

| Param           	| Type      	| Description                           	                |
|------------------	|-----------	|---------------------------------------	                |
| `SequelizeModels` | `Array`   	| Convert instances in array to Attributes                |
| `withMethods`    	| `Boolean` 	| Populate `<Attributes>` objects with sequelize methods  |


----


### Module Import
```javascript
    import { getArrayData } from 'sequelize-relay';
```

### About

The `getArrayData` and [resolveArrayData](resolveArrayData.md) methods are very similar as they both return
an Array of Attributes objects.  The difference is `resolveArrayData` expects a **promised**
Attributes `Array`, but the `getArrayData` method expects an Attributes `Array`.

### Examples
*For more information about how sequelize models work, [click here](http://docs.sequelizejs.com/en/latest/docs/models-definition/).*

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

Now let's pretend we created a few different Users and we wanted to retrieve a list, but only get their attributes.

> NOTE: Sequelize will automatically create helper functions and also pluralize Users in the db object.

```javascript
db.Users.findAll().then(function (users) => {
  console.log(users); // complex multi array with circular objects, etc. good for some use-cases.
  var justThePropsPlease = getArrayData(users); // flattened array like the SQL table.
  var propsAndMethods = getArrayData(users, true); // flattened array with only getters/setters excluding static methods.
});
```

#### Example 2

Consider a `sequelize` model named `Person`:

```javascript
import { Person } from 'myDatabase';
import { getArrayData, getModelsByClass } from 'sequelize-relay';

async function getFlatArrayOfPeople () {
  let sequelizeArray = await getModelsByClass(Person);
  return getArrayData(sequelizeArray);
}
```

#### Example 3
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
        connectionFromArray(
          getArrayData(person.getArticles()), args
        )
    }
  })
});
```
*For more information about `connectionArgs` and `connectionFromArray`, [click here](https://github.com/graphql/graphql-relay-js#connections).*

`person.getArticles`, a sequelize method, will be passed in as our argument
to `resolveArrayData` - which will then in turn return a correctly
structured promise to `connectionFromPRomisedArray` which is a method
imported from thw `graphql-relay-js` library.

We are running our helper methods along with graphql-relay and graphql
libraries, the usage of `resolveArrayData` can be noted here:

```javascript
resolve: (person, args) =>
  connectionFromArray(
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
