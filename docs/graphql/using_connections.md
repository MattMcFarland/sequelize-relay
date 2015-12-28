# GraphQL-Relay - Using connections
This section is about using [graphql-relay-js](https://github.com/graphql/graphql-relay-js) with sequalize-relay.

---


Connections are a big part of the graphql-relay-js library, and sequelize-relay works with it in the following ways:


## Setup nodes for connections
`nodeDefinitions` should be configured to allow for using the connection helpers...

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
      case 'Person':
        // sequelize method
        return Person.findByPrimary(id);
      case 'Article':
        // sequelize method
        return Article.findByPrimary(id);
       default:
       return null;
       
    }
  },
  (obj) => {
    switch (obj.type) {
      // the types are pulled from sequelize.
      case 'personType':
        return personType;
      case 'articleType':
        return articleType;
      
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

#### Person.js
```javascript
module.exports = function (sequelize, DataTypes) {

  var Person = sequelize.define('Person', {
    type: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING),
      get() {
        return 'personType';
      }
    },
    additionalName: {
      type: DataTypes.STRING,
      description: 'An additional name for a Person, can be used for a ' +
      'middle name.'
    },
    address: {
      type: DataTypes.STRING,
      description: 'Physical address of the item.'
    },
    email: {
      type: DataTypes.STRING,
      description: 'Email address',
      validate: {
        isEmail: true
      }
    },
    familyName: {
      type: DataTypes.STRING,
      description: 'Family name. In the U.S., the last name of an Person. ' +
      'This can be used along with givenName instead of the name property.'
    },
    givenName: {
      type: DataTypes.STRING,
      description: 'Given name. In the U.S., the first name of a Person. ' +
      'This can be used along with familyName instead of the name property.'
    },
    honorificPrefix: {
      type: DataTypes.STRING,
      description: 'An honorific prefix preceding a Person\'s name such as ' +
      'Dr/Mrs/Mr.'
    },
    honorificSuffix: {
      type: DataTypes.STRING,
      description: 'An honorific suffix preceding a Person\'s name such as ' +
      'M.D. /PhD/MSCSW.'
    },
    jobTitle: {
      type: DataTypes.STRING,
      description: 'The job title of the person ' +
      '(for example, Financial Manager).'
    },
    telephone: {
      type: DataTypes.STRING,
      description: 'The telephone number.'
    }
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


The `connections` are then mapped in the `graphQL` schema file(s).

### articleType

```javascript
var articleType = new GraphQLObjectType({
  name: 'Article',
  description: 'An article, such as a news article or piece of ' +
  'investigative report. Newspapers and magazines have articles of many ' +
  'different types and this is intended to cover them all.',
  fields: () => ({
    id: globalIdField(),
    articleBody: {
      type: GraphQLString,
      description: 'The actual body of the article.',
      resolve: article => article.articleBody
    },
    articleSection: {
      type: GraphQLString,
      description: 'Articles may belong to one or more "sections" in a ' +
      'magazine or newspaper, such as Sports, Lifestyle, etc.',
      resolve: article => article.articleSection
    },
    headline: {
      description: 'Headline of the article.',
      type: GraphQLString,
      resolve: article => article.headline
    },
    thumbnailUrl: {
      description: 'A URL path to the thumbnail image relevant to ' +
      'the Article.',
      type: GraphQLString,
      resolve: article => article.thumbnailUrl
    },
    author: {
      description: 'Returns the Author or null.',
      type: personType,
      resolve: article => article.getAuthor()
    }
  }),
  interfaces: [nodeInterface]
});
```

The relay spec is then applied once we create the connection:

```javascript

var {connectionType: articleConnection} =
  connectionDefinitions({nodeType: articleType});

```

## Connection Patterns
You can see the patterns for connections as follows

### foo
```javascript
var fooType = new GraphQLObjectType({
  name: 'Foo',
  fields: () => ({
    id: globalIdField(),
    someProp: {
      type: GraphQLString,
      resolve: foo => foo.prop
    },
    anotherProp: {
      type: GraphQLString,
      resolve: foo => foo.anotherProp
    }
  }),
  interfaces: [nodeInterface]
});


var {connectionType: fooConnection} =
  connectionDefinitions({nodeType: fooType});


```
### bar
```javascript
var barType = new GraphQLObjectType({
  name: 'Bar',
  fields: () => ({
    id: globalIdField(),
    someProp: {
      type: GraphQLString,
      resolve: bar => bar.prop
    },
    anotherProp: {
      type: GraphQLString,
      resolve: bar => bar.anotherProp
    }
  }),
  fooFriends: {
  type: fooConnection,
  args: connectionArgs,
  resolve: (bar, args) =>
    connectionFromPromisedArray(
      resolveArrayData(bar.getFooFriends()), args
    )
  }
  interfaces: [nodeInterface]
});

var {connectionType: barConnection} =
  connectionDefinitions({nodeType: barType});
```

### baz
```javascript
var bazType = new GraphQLObjectType({
  name: 'baz',
  fields: () => ({
    id: globalIdField(),
    someProp: {
      type: GraphQLString,
      resolve: baz => baz.prop
    },
    anotherProp: {
      type: GraphQLString,
      resolve: baz => baz.anotherProp
    },
    fooFriends: {
      type: fooConnection,
      args: connectionArgs,
      resolve: (baz, args) =>
        connectionFromPromisedArray(
          resolveArrayData(baz.getFooFreindss()), args
      )
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: bazConnection} =
  connectionDefinitions({nodeType: bazType});


```

#### the connectionDefintions again:
They are above, but it might be worth sharing them one more time:


### foo
```javascript

var {connectionType: fooConnection} =
  connectionDefinitions({nodeType: fooType});


```
### bar
```javascript

var {connectionType: barConnection} =
  connectionDefinitions({nodeType: barType});


```
### baz
```javascript


var {connectionType: bazConnection} =
  connectionDefinitions({nodeType: bazType});


```

## connectionArgs

Connections are useful when dealing with relationships. Let's Presume that `getFooFriends` is a valid sequelize method (could arguably be as such).


### baz
```javascript
var bazType = new GraphQLObjectType({
  name: 'baz',
  fields: () => ({
    id: globalIdField(),
    someProp: {
      type: GraphQLString,
      resolve: baz => baz.prop
    },
    anotherProp: {
      type: GraphQLString,
      resolve: baz => baz.anotherProp
    },
    fooFriends: {
      type: fooConnection,
      args: connectionArgs,
      resolve: (baz, args) =>
        connectionFromPromisedArray(
          resolveArrayData(baz.getFooFreindss()), args
      )
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: bazConnection} =
  connectionDefinitions({nodeType: bazType});
```

Notice we are using `connectionArgs`, `connectionDefinitions`, and `noteInterface`?

### bar
```javascript
var barType = new GraphQLObjectType({
  name: 'Bar',
  fields: () => ({
    id: globalIdField(),
    someProp: {
      type: GraphQLString,
      resolve: bar => bar.prop
    },
    anotherProp: {
      type: GraphQLString,
      resolve: bar => bar.anotherProp
    }
  }),
  fooFriends: {
  type: fooConnection,
  args: connectionArgs,
  resolve: (bar, args) =>
    connectionFromPromisedArray(
      resolveArrayData(bar.getFooFriends()), args
    )
  }
  interfaces: [nodeInterface]
});

var {connectionType: barConnection} =
  connectionDefinitions({nodeType: barType});
```

Again, we see that we are using `connectionArgs`, `connectionDefinitions`, and `noteInterface`....


Following the patterns depicted above will guarantee you retrieve all of the `relay` `edges` and `pageInfo` - cursors and all..


The only `sequelize-relay` method used for these examples was `resolveArrayData`






