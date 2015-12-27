# Connection Patterns

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

