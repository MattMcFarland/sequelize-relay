/**
 * GraphQL Library
 */
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

/**
 * GraphQL-Relay Modules
 */
import {
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
  connectionFromPromisedArray,
  connectionArgs,
  connectionDefinitions,
} from 'graphql-relay';

import {
  getAll,
  mappedArray
} from '../methods';

import {
  models
} from '../../../sequelize';

const { Person, Article } = models;

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
      case 'Person':
        return Person.findByPrimary(id);
      case 'Article':
        return Article.findByPrimary(id);
      default:
        return null;
    }
  },
  (obj) => {
    switch (obj.type) {
      case 'personType':
        return personType;
      case 'articleType':
        return articleType;
      default:
        return null;
    }
  }
);

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
      resolve: article => article.headline()
    },
    thumbnailUrl: {
      description: 'A URL path to the thumbnail image relevant to ' +
      'the Article.',
      type: GraphQLString,
      resolve: article => article.thumbnailUrl
    },
    author: {
      description: 'Returns the Comment that has been articleged or null ' +
      'if it is not a comment.',
      type: personType,
      resolve: article => article.getAuthor()
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: articleConnection} =
  connectionDefinitions({nodeType: articleType});

var personType = new GraphQLObjectType({
  name: 'Vote',
  description: 'A vote object that is applied to posts, questions, ' +
  'answers, comments, etc',
  fields: () => ({
    id: globalIdField(),
    address: {
      type: GraphQLString,
      description: 'Physical address of the item.',
      resolve: person => person.address
    },
    email: {
      type: GraphQLString,
      description: 'Email address',
      resolve: person => person.email
    },
    familyName: {
      type: GraphQLString,
      description: 'Family name. In the U.S., the last name of an Person. ' +
      'This can be used along with givenName instead of the name property.',
      resolve: person => person.familyName
    },
    givenName: {
      type: GraphQLString,
      description: 'Given name. In the U.S., the first name of a Person. ' +
      'This can be used along with familyName instead of the name property.',
      resolve: person => person.givenName
    },
    honorificPrefix: {
      type: GraphQLString,
      description: 'An honorific prefix preceding a Person\'s name such as ' +
      'Dr/Mrs/Mr.',
      resolve: person => person.honorificPrefix
    },
    honorificSuffix: {
      type: GraphQLString,
      description: 'An honorific suffix preceding a Person\'s name such as ' +
      'M.D. /PhD/MSCSW.',
      resolve: person => person.honorificSuffix
    },
    jobTitle: {
      type: GraphQLString,
      description: 'The job title of the person ' +
      '(for example, Financial Manager).',
      resolve: person => person.jobTitle
    },
    telephone: {
      type: GraphQLString,
      description: 'The telephone number.',
      resolve: person => person.telephone
    },
    articlesAuthored: {
      type: articleConnection,
      args: connectionArgs,
      resolve: (person, args) =>
        connectionFromPromisedArray(mappedArray(person.getArticles()), args)
    }
  }),
  interfaces: [nodeInterface]
});

var {connectionType: personConnection} =
  connectionDefinitions({nodeType: personType});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    people: {
      decription: 'People',
      type: personConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(mappedArray(getAll(Person)), args)
    },
    articles: {
      decription: 'Articles',
      type: personConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(mappedArray(getAll(Person)), args)
    },
    node: nodeField
  })
});

export default new GraphQLSchema({
  query: queryType
});
