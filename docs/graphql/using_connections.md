# Using connections

Connections are a big part of the graphql-relay-js library, and sequelize-relay works with it in the following ways:


### sequelize-relay steps aside

sequelize-relay steps aside and lets graphql-relay-js do what it does best.  For example, we can use graphql-relay-js to setup the connection nodes like so:

### Setting up relay nodes:

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