# Using nodeDefinitions

## Setting up relay nodes:

We can use `nodeDefinitions` from `graphql-relay-js` in conjunction with `sequelize` helpers to setup the node definition.  This setup does not need the `sequelize-relay` library.

What we need to do is wire up a `sequelize` model to the `nodeDefinitions` function.  

## import the modules:

```javascript
import {
  nodeDefinitions,
  fromGlobalId
} from 'graphql-relay-js';
```

I have personally used the following boilerplate to setup the `nodeDefinitions`.  I welcome other implementations, but the first step for me is to copy and paste the following code into the `schema` file


## nodeDefinitions boilerplate:
```javascript
/**
 * We get the node interface and field from the relay library.
 *
 * The first method is the way we resolve an ID to its object.
 * The second is the way we resolve an object that implements 
 * node to its type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    switch (type) {
    // we will use sequelize to resolve the id of its object
      default:
        return null;
    }
  },
  (obj) => {
    // we will use sequelize to resolve the object tha timplements node
    // to its type.
    switch (obj.type) {
      default:
       return null;
    }
  }
);
```


> You can quickly setup sequelize by following [this guide](../sequelize/quick_setup_md) or by reading the [sequelize "GettingStarted" Guide](http://docs.sequelizejs.com/en/latest/docs/getting-started/)._


Consider a sequelize model called `person` with the code below:

### models/Person.js
```javascript

module.exports = function (sequelize, DataTypes) {

  var Person = sequelize.define('Person', {
    address: {
      type: DataTypes.STRING,
      description: 'Physical address of the person.'
    },
    email: {
      type: DataTypes.STRING,
      description: 'Email address',
      validate: {
        isEmail: true
      }
    },
    givenName: {
      type: DataTypes.STRING,
      description: 'Given name. In the U.S., the first name of a Person. ' +
      'This can be used along with familyName instead of the name property.'
    }
  });
  return Person;
};

```

To connect with `nodeDefinitions`, we need to add virtual types to our `sequelize` model schema:

#### Add personType VIRTUAL to the model
**This adds a field without putting it in the SQL table**


```javascript
type: {
  type: new DataTypes.VIRTUAL(DataTypes.STRING),
  get() {
    return 'personType';
  }
}
```

### models/Person.js with type added
```javascript

module.exports = function (sequelize, DataTypes) {

  var Person = sequelize.define('Person', {
    type: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING),
      get() {
        return 'personType';
      }
    },
    address: {
      type: DataTypes.STRING,
      description: 'Physical address of the person.'
    },
    email: {
      type: DataTypes.STRING,
      description: 'Email address',
      validate: {
        isEmail: true
      }
    },
    givenName: {
      type: DataTypes.STRING,
      description: 'Given name. In the U.S., the first name of a Person. ' +
      'This can be used along with familyName instead of the name property.'
    }
  });
  return Person;
};

```


By adding the `type` field returning `personType` - we can then wire it up to `nodeDefinitions` like so:


## nodeDefintions Update

```javascript
/**
 * We get the node interface and field from the relay library.
 *
 * The first method is the way we resolve an ID to its object.
 * The second is the way we resolve an object that implements 
 * node to its type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    switch (type) {
      case 'Person':
        return Person.findByPrimary(id);
      default:
        return null;
    }
  },
  (obj) => {
    // we will use sequelize to resolve the object tha timplements node
    // to its type.
    switch (obj.type) {
      case 'personType':
        return personType;
      default:
       return null;
    }
  }
);
```

### Define Person and personType 
Well the code above doesnt explain where Person or personType is coming from.  This shall be demystified now:


- Person is the Model Class that we created earlier from Person.js
- personType is a GraphQL type schema that needs to be created.


** Adding person**
```javascript
import { Person } from './models';
```
** Adding personType **

```javascript

var personType = new GraphQLObjectType({
  name: 'Person',
  description: 'A Person',
  fields: () => ({
    id: globalIdField(),
  }),
  interfaces: [nodeInterface] // <-- Hooking up the nodeInterface
});
```


That's all there is to it.

