## resolveArrayByClass ⇒ `Promise.<Array.<`Attributes`>>`
**resolveArrayByClass(`<`SequelizeClass`>`, `withMethods` :`Boolean` `=` `false`)**

  **`⇒` Promise`<`Array`<`Attributes`>>`**

First, it internally resolves an an `Array` of `<`SequelizeModel`>` instances
that are of the passed-in SequelizeClass. Then it converts the `Array` into a
**promised** `Array` of `<`Attributes`>` object literals.


**Returns**: Promise`<Array<`Attributes`>>`

| Param           	| Type      	| Description                           	                                                          |
|------------------	|-----------	|---------------------------------------	                                                          |
| `SequelizeClass` 	| `Class`   	| A specific `SequelizeClass` to process. 	                                                          |                                                        |
| `withMethods`    	| `Boolean` 	| If true, the `<Attributes>` objects wil also contain the get/set methods from the `<SequelizeModel>`  |


The `resolveArrayByClass` combines [resolveModelsByClass](resolveModelsByClass.md) and [getArrayData](getArrayData.md)
 into one function for easier use of the API.

In a nut shell:

```
  resolveModelsByClass(ClassName)
    === getArrayData(resolveModelsByClass(ClassName));
```

For more detailed documentation see [resolveModelsByClass](resolveModelsByClass.md) and [getArrayData](getArrayData.md).


### Examples

Consider the following GraphQL Schema Type for `queryType`:

```javascript
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    people: {
      description: 'People',
      type: personConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveArrayByClass(Person), args)
    },
    peopleWithMethods: {
      description: 'People with methods',
      type: personConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveArrayByClass(Person, true), args)
    },
    articles: {
      description: 'Articles',
      type: articleConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveArrayByClass(Article), args)
    },
    node: nodeField
  })
});

```
*For more information about `connectionArgs` and `connectionFromPromisesdArray`, [click here](https://github.com/graphql/graphql-relay-js#connections).*

From there, we are able to pass graphql-relay queries like so:

```
{
  peopleWithMethods(first: 2) {
    pageInfo {
      startCursor
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        givenName
        familyName
        address
      }
    }
  }
}
```


```
{
  articles(first: 2) {
    pageInfo {
      startCursor
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        givenName
        familyName
        address
      }
    }
  }
}
```



#### More Examples

You can view more examples by reviewing the source code:

- Full [Person Model](../../sequelize/models/Person.js) Example from test source
- Full [GraphQL Setup](../../src/data/__tests__/connections.js) Example from test source
