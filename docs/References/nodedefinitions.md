# nodeDefinitions

`nodeDefinitions` are configured in the schema.js file.

### Module Imports

```javascript
import {
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
  // connectionFromArray,
  connectionFromPromisedArray,
  connectionArgs,
  connectionDefinitions,
  // mutationWithClientMutationId
} from 'graphql-relay';
```


### The node interface and field
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

### nodeType
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
