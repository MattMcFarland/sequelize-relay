## resolveModelsByClass ⇒ `Array.<`SequelizeModel`>`
**resolveModelsByClass(`<`SequelizeClass`>`) ⇒ `Promise<Array<`SequelizeModel`>>`**

Returns a **promised** `Array` of `<`SequelizeModel`>` objects by SequelizeClass.


**Returns**: Promise.<Array<`SequelizeModel`>>


| Param           	| Type      	| Description                           	                                                          |
|------------------	|-----------	|---------------------------------------	                                                          |
| `SequelizeClass` 	| `Class`   	| A specific `SequelizeClass` to process. 	                                                          |                                                        |


----



### Module Import
```javascript
    import { resolveModelsByClass } from 'sequelize-relay';
```


The `resolveModelsByClass` and [getModelsByClass](getModelsByClass.md) methods are very similar as they both return
an Array of Attributes objects.  The difference is `getModelsByClass` returns the Attributes `Array` immediately, whereas
`resolveModelsByClass` returns only the **promised** Attributes `Array`..

### Examples
*For more information about how sequelize models work, [click here](http://docs.sequelizejs.com/en/latest/docs/models-definition/).*

#### Example 1

Consider the following sequelize script:

```javascript
export var User = sequelize.define('user', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING
});
```

A simple db connection export:
```javascript
export const models = require('./models/index');

export const connect = () => {
  return new Promise((resolve, reject) => {
    try {
      models.sequelize.sync().then(() => {
          resolve(models);
      });
    } catch (error) {
      reject(error);
    }
  });
};
```

Now let's pretend we created a few different Users and we wanted to retrieve a list, but only get their attributes.


```javascript
import { models, connect } from 'myDatabase';
import { getArrayData, resolveModelsByClass } from 'sequelize-relay';

var User = models.User;
connect.then(db => {
  console.log('connected to db!');
  resolveModelsByClass(User).then((usersList) => {
    console.log('The userlist has been collected', userList);
    console.log('Just the user props', getArrayData(userList));
    console.log('Just user props and methods', getArrayData(userList, true));
  }).catch(err => console.error(err));
});
```

#### Example 2


Using with Relay:
```javascript


var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      description: 'Users',
      type: userConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(User), args)
    },
    node: nodeField
  })
});
```
*For more information about `connectionArgs` and `nodeField`, [click here](https://github.com/graphql/graphql-relay-js#connections).*

Adds the appropriate connections, `edges`, `cursor`, etc...

So now we can query our users table the relay-way like so:

```
  users(first: 4) {
    pageInfo {
      startCursor
      endCursor
    }
    edges {
      id
      firstName
      lastName
    }
  }
```




#### More Examples

You can view more examples by reviewing the source code:

- Full [Person Model](../../sequelize/models/Person.js) Example from test source
- Full [GraphQL Setup](../../src/data/__tests__/connections.js) Example from test source
