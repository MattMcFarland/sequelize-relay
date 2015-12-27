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


### nodeInterface usage
`nodeInterface` appears to be used for every query type that is not root.

for example:

```javascript
var requestType = new GraphQLObjectType({
  name: 'Request',
  description: 'Tutorial Request',
  fields: () => ({
    id: globalIdField(),
    url: {
      type: GraphQLString,
      description: 'href location to the tutorial request page.',
      resolve: request => request.url
    },
    dateCreated: {
      type: GraphQLString,
      description: 'The date on which the Tutorial Request was created ' +
      'or the item was added to a DataFeed.',
      resolve: request => request.createdAt
    },
    dateModified: {
      type: GraphQLString,
      description: 'The date on which the Tag was most recently modified ' +
      'or when the item\'s entry was modified within a DataFeed.',
      resolve: request => request.updatedAt
    },
    author: {
      type: userType,
      description: 'The user who authored this request.',
      resolve: request => request.getAuthor()
    },
    headline: {
      type: GraphQLString,
      description: 'Also considered the title of this request.',
      resolve: request => request.headline
    },
    slug: {
      type: GraphQLString,
      description: 'The headline sluggified for creating seo friendly url.',
      resolve: request => slugify(request.updatedAt)
    },
    content: {
      type: GraphQLString,
      description: 'The main body content of the tutorial request, ' +
      'contains markdown syntax.',
      resolve: request => request.content
    },
    comments: {
      type: commentConnection,
      description: 'List of comments posted on this tutorial request.',
      args: connectionArgs,
      resolve: (request, args) =>
        connectionFromPromisedArray(mappedArray(request.getComments()), args)
    },
    tags: {
      type: tagConnection,
      description: 'List of tags posted on this tutorial request.',
      args: connectionArgs,
      resolve: (request, args) =>
        connectionFromPromisedArray(mappedArray(request.getTags()), args)
    },
    tutorials: {
      type: tutorialConnection,
      description: 'List of tutorials posted as replies to this tutorial ' +
      'request.',
      args: connectionArgs,
      resolve: (request, args) =>
        connectionFromPromisedArray(mappedArray(request.getTutorials()), args)
    },
    votes: {
      type: voteConnection,
      description: 'List of vote objects containing the users and ' +
      'their votes.',
      args: connectionArgs,
      resolve: (request, args) =>
        connectionFromPromisedArray(mappedArray(request.getComments()), args)
    },
    flags: {
      type: flagConnection,
      description: 'List of flag objects containing the users and ' +
      'their flags.',
      args: connectionArgs,
      resolve: (request, args) =>
        connectionFromPromisedArray(mappedArray(request.getFlags()), args)
    },
    score: {
      type: GraphQLInt,
      description: 'Total score of the post after considering all of ' +
      'the down/up votes.',
      resolve: request => request.score
    },
    downVoteCount: {
      type: GraphQLInt,
      description: 'Sum total of down votes',
      resolve: request => request.downVoteCount
    },
    upVoteCount: {
      type: GraphQLInt,
      description: 'Sum total of up votes',
      resolve: request => request.upVoteCount
    }
  }),
  interfaces: [nodeInterface] // <- nodeInterface
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

