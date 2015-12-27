# nodeDefinitions

`nodeDefinitions` are configured in the schema.js file.

### Module Imports

```javascript
import {
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
  connectionArgs,
  connectionDefinitions,
} from 'graphql-relay';
```


### Defining nodeInterface and nodeField 
The following is an excerpt for a prototype version of [wanted-tuts.com](https://wanted-tuts.com)

```javascript
/**
 * We get the node interface and field from the relay library.
 *
 * The first method is the way we resolve an ID to its object.
 * The second is the way we resolve an object that implements node to its type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    // console.log('nodeDefinitions', type, id, globalId);
    switch (type) {
      case 'User':
        return getUser(id);
      case 'Comment':
        return getComment(id);
      case 'Tag':
        return getTag(id);
      case 'Vote':
        return getVote(id);
      case 'Flag':
        return getFlag(id);
      case 'Tutorial':
        return getTutorial(id);
      case 'StormUser':
        return getStormUser(id);
      case 'Request':
        return getRequest(id);
      default:
        return null;
    }
  },
  (obj) => {
    switch (obj.type) {
      case 'userType':
        return userType;
      case 'commentType':
        return commentType;
      case 'tagType':
        return tagType;
      case 'voteType':
        return voteType;
      case 'flagType':
        return flagType;
      case 'tutorialType':
        return tutorialType;
      case 'StormUser':
        return StormUser;
      case 'requestType':
        return requestType;
      default:
        return null;
    }
  }
);
```

### nodeField usage in the wild
nodeField appears to be used at the value of `node` in a root query. **(see the bottom of this snippet)**
```javascript
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      decription: 'Sitewide users',
      type: userConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(User), args)
    },
    comments: {
      decription: 'Sitewide User comments',
      type: commentConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(Comment), args)
    },
    tags: {
      decription: 'Sitewide tags used for categorizing posts.',
      type: tagConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(Tag), args)
    },
    votes: {
      decription: 'Sitewide votes across the site.',
      type: voteConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(Vote), args)
    },
    flags: {
      decription: 'Sitewide flags across the site.',
      type: flagConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(Flag), args)
    },
    tutorials: {
      description: 'Tutorials added to the site as a request fufillment or ' +
      'anything else.',
      type: tutorialConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(Tutorial), args)
    },
    requests: {
      decription: 'Tutorial Request Posts',
      args: connectionArgs,
      type: requestConnection,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveModelsByClass(Request), args)
    },
    node: nodeField // <- Bam
  })
});
```


### nodeType and connectDefinitions
The following code shows `nodeType` in use via `connectionDefinitions`

```javascript
var {connectionType: flagConnection} =
  connectionDefinitions({nodeType: flagType});
```

.. and so on...

```javascript
var {connectionType: fooConnection} =
  connectionDefinitions({nodeType: fooType});
```

