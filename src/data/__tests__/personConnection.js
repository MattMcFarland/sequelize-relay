/**
 * personConnection.js
 */


import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  graphql,
} from 'graphql';

import {
  nodeDefinitions,
  fromGlobalId,
  globalIdField,
  connectionFromPromisedArray,
  connectionArgs,
  connectionDefinitions,
} from 'graphql-relay';

import {
  getArrayData,
  getModelsByClass,
  getArrayByClass,
  resolveArrayByClass
} from '../methods';

import {
  models, connect
} from '../../../sequelize';


import { expect } from 'chai';
import { describe, it, before } from 'mocha';


describe('test relay connections with sequelize', () => {
  const { Person, Article } = models;
  var {nodeInterface, nodeField} = nodeDefinitions(
    (globalId) => {
      var {type, id} = fromGlobalId(globalId);
      console.log('nodeDefinitions', type, id, globalId);
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
        default:
          return null;
      }
    }
  );

  var personType = new GraphQLObjectType({
    name: 'Person',
    description: 'A Person',
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
          connectionFromPromisedArray(resolveArrayByClass(Person), args)
      },
      articles: {
        decription: 'Articles',
        type: personConnection,
        args: connectionArgs,
        resolve: (root, args) =>
          connectionFromPromisedArray(getArrayByClass(Article), args)
      },
      node: nodeField
    })
  });

  var schema = new GraphQLSchema({
    query: queryType
  });


  let db;


  before((done) => {
    connect().then((_db) => {
      db = _db;
      done();
    });
  });

  it('connects to the database', () => {
    expect(db).to.not.be.an('undefined');
  });

  describe('getModelsByClass(Person) => sequelizeArray', () => {

    let sequelizeArray;
    it('returns a promise that resolves to a ' +
      'sequelize Model Array', async () => {
      sequelizeArray = await getModelsByClass(Person);
      expect(sequelizeArray).to.be.a('array');

      it('contains a sequelize Array of Models', () => {
        expect(sequelizeArray[0]).to.have.property('dataValues');
      });

    });


    describe('getArrayData(sequelizeArray) => consumableArray', () => {

      let consumableArray;
      it('returns a promise that resolves to ' +
        'consumable array', async () => {
        consumableArray = await getArrayData(sequelizeArray);
        expect(consumableArray).to.be.an('array');

      });

      it('matches fixture', () => {

        var theArray = consumableArray.map(item => {
          let obj = {};
          Object.keys(item).forEach((key) => {
            if (key !== 'createdAt' && key !== 'updatedAt') {
              obj[key] = item[key];

            }
          });
          return obj;
        });

        var expected = [
          {
            type: 'personType',
            id: 1,
            additionalName: 'Lilyan',
            address: '40831 Chad Rue',
            email: 'Aryanna99@yahoo.com',
            familyName: 'Reinger',
            givenName: 'Jaylan',
            honorificPrefix: 'Dr.',
            honorificSuffix: 'IV',
            jobTitle: 'Internal Program Officer',
            telephone: '259-536-5663 x8533'
          },
          {
            type: 'personType',
            id: 2,
            additionalName: 'Viva',
            address: '197 Mina Gardens',
            email: 'Creola5@gmail.com',
            familyName: 'Schmeler',
            givenName: 'Amir',
            honorificPrefix: 'Miss',
            honorificSuffix: 'DVM',
            jobTitle: 'Lead Creative Executive',
            telephone: '718-964-7388 x29503'
          },
          {
            type: 'personType',
            id: 3,
            additionalName: 'Urban',
            address: '109 Ottilie Pass',
            email: 'Marlen.White@gmail.com',
            familyName: 'Adams',
            givenName: 'Bobbie',
            honorificPrefix: 'Dr.',
            honorificSuffix: 'III',
            jobTitle: 'Corporate Infrastructure Engineer',
            telephone: '(869) 709-9551 x31769'
          },
          {
            type: 'personType',
            id: 4,
            additionalName: 'Everardo',
            address: '60340 Gleason Heights',
            email: 'Kyle92@yahoo.com',
            familyName: 'Abbott',
            givenName: 'Berta',
            honorificPrefix: 'Dr.',
            honorificSuffix: 'III',
            jobTitle: 'Human Tactics Specialist',
            telephone: '1-265-145-9618 x199'
          },
          {
            type: 'personType',
            id: 5,
            additionalName: 'Gussie',
            address: '13458 Dayana Ramp',
            email: 'Hailie_Boyle94@gmail.com',
            familyName: 'Fahey',
            givenName: 'Eleonore',
            honorificPrefix: 'Ms.',
            honorificSuffix: 'MD',
            jobTitle: 'Global Interactions Associate',
            telephone: '246-139-3322 x196'
          },
          {
            type: 'personType',
            id: 6,
            additionalName: 'Aidan',
            address: '3382 O\'Conner Cliff',
            email: 'Loyce_Donnelly@yahoo.com',
            familyName: 'Mueller',
            givenName: 'Jennie',
            honorificPrefix: 'Mrs.',
            honorificSuffix: 'V',
            jobTitle: 'Human Identity Associate',
            telephone: '805-079-1652 x66842'
          },
          {
            type: 'personType',
            id: 7,
            additionalName: 'Gloria',
            address: '4552 Swift Inlet',
            email: 'Leilani41@gmail.com',
            familyName: 'Rogahn',
            givenName: 'Adrienne',
            honorificPrefix: 'Ms.',
            honorificSuffix: 'DDS',
            jobTitle: 'Dynamic Communications Technician',
            telephone: '1-048-314-3269 x395'
          },
          {
            type: 'personType',
            id: 8,
            additionalName: 'Pamela',
            address: '1249 Merlin Trail',
            email: 'Anais_VonRueden85@gmail.com',
            familyName: 'Gulgowski',
            givenName: 'Genoveva',
            honorificPrefix: 'Miss',
            honorificSuffix: 'DVM',
            jobTitle: 'Regional Security Representative',
            telephone: '340.537.5704'
          },
          {
            type: 'personType',
            id: 9,
            additionalName: 'Hailee',
            address: '5637 Will Road',
            email: 'Lavada.Tillman@hotmail.com',
            familyName: 'Stehr',
            givenName: 'Aiyana',
            honorificPrefix: 'Miss',
            honorificSuffix: 'IV',
            jobTitle: 'Investor Integration Strategist',
            telephone: '(712) 600-5091'
          },
          {
            type: 'personType',
            id: 10,
            additionalName: 'Jeffrey',
            address: '66543 Rick Lock',
            email: 'Friedrich_Block1@gmail.com',
            familyName: 'Johns',
            givenName: 'Gracie',
            honorificPrefix: 'Miss',
            honorificSuffix: 'V',
            jobTitle: 'Legacy Web Director',
            telephone: '306-361-6895'
          }
        ];
        expect(theArray).to.deep.equal(expected);
      });


    });


  });




  describe('conversion to relay specification', () => {

    it('has connection and edge fields', (done) => {
      var query = `
        {
          people(first: 2) {
            pageInfo {
              startCursor
              hasNextPage
            }
            edges {
              cursor
              node {
                id
                givenName
                familyName
                address
              }
            }
          }
        }`;
      var expected = {
        data: {
          people: {
            pageInfo: {
              startCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
              hasNextPage: true
            },
            edges: [
              {
                cursor: 'YXJyYXljb25uZWN0aW9uOjA=',
                node: {
                  id: 'UGVyc29uOjE=',
                  givenName: 'Jaylan',
                  familyName: 'Reinger',
                  address: '40831 Chad Rue'
                }
              },
              {
                cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
                node: {
                  id: 'UGVyc29uOjI=',
                  givenName: 'Amir',
                  familyName: 'Schmeler',
                  address: '197 Mina Gardens'
                }
              }
            ]
          }
        }
      };
      graphql(schema, query).then((theResponse) => {
        expect(theResponse).to.deep.equal(expected);
        done();
      });
    });

    it('can get next page', (done) => {
      let theResponse;
      var query = `
        {
          people(first: 2, after: "YXJyYXljb25uZWN0aW9uOjE") {
            pageInfo {
              startCursor
              hasNextPage
            }
            edges {
              cursor
              node {
                id
                givenName
                familyName
                address
              }
            }
          }
        }`;
      var expected = {
        data: {
          people: {
            pageInfo: {
              startCursor: 'YXJyYXljb25uZWN0aW9uOjI=',
              hasNextPage: true
            },
            edges: [
              {
                cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
                node: {
                  id: 'UGVyc29uOjM=',
                  givenName: 'Bobbie',
                  familyName: 'Adams',
                  address: '109 Ottilie Pass'
                }
              },
              {
                cursor: 'YXJyYXljb25uZWN0aW9uOjM=',
                node: {
                  id: 'UGVyc29uOjQ=',
                  givenName: 'Berta',
                  familyName: 'Abbott',
                  address: '"60340 Gleason Heights'
                }
              }
            ]
          }
        }
      };
      graphql(schema, query).then((res) => {
        done();
        theResponse = res;
      });
      it('matches fixture', (en) => {
        expect(theResponse).to.deep.equal(expected);
        en();
      });
    });
  });


});



