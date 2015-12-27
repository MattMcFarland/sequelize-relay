# Using nodeDefinitions

### Setting up relay nodes:

We can use `nodeDefinitions` from `graphql-relay-js` in conjunction with `sequelize` helpers to setup the node definition.  This setup does not need the `sequelize-relay` library.

What we need to do is wire up a `sequelize` model to the `nodeDefinitions` function.  

#### import the modules:

```javascript
import {
  nodeDefinitions,
  fromGlobalId
} from 'graphql-relay-js';
```

I have personally used the following boilerplate to setup my nodeDefinitions.  I welcome other implementations, but the first step for me is to copy and paste the following code into the `schema` file


#### nodeDefinitions boilerplate:
```javascript
// nodeDefinitions is a sequelize-relay-js method

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




For this to work, we need to add virtual types to our sequelize model schema:

#### Article.js
Article.js is a standard sequelize model with the addition of the `type` field which is a `DataTypes.VIRTUAL`

Using `DataTypes.VIRTUAL`:
```javascript
type: {
  type: new DataTypes.VIRTUAL(DataTypes.STRING),
  get() {
    return 'articleType';
  }
}
```

By adding the `type` field returning `articleType` - the node is complete.


```javascript
module.exports = function (sequelize: Sequelize, DataTypes) {
  var Article = sequelize.define('Article', {
    type: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING),
      get() {
        return 'articleType';
      }
    },
    articleBody: {
      type: DataTypes.TEXT,
      description: 'The actual body of the article.'
    },
    articleSection: {
      type: DataTypes.STRING,
      description: 'Articles may belong to one or more "sections" in a ' +
      'magazine or newspaper, such as Sports, Lifestyle, etc.'
    },
    headline: {
      type: DataTypes.STRING,
      description: 'Headline of the article.'
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      description: 'A URL path to the thumbnail image relevant to the Article.'
    }
  }, {
    classMethods: {
      associate: (models) => {
        Article.belongsTo(models.Person, {as: 'Author'});
      }
    }
  });
  return Article;
};

```
