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
  getModelsByClass,
  resolveArrayData,
  getArrayData,
  resolveArrayByClass,
  resolveModelsByClass
} from '../methods';

import {
  models, connect
} from '../../../sequelize';


import { expect } from 'chai';
import { describe, it, before } from 'mocha';

const { Person, Article } = models;
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    switch (type) {
      case 'Person':
        return Person.findByPrimary(id);
      case 'Article':
        return Article.findByPrimary(id);
      /*
       default:
       return null;
       */
    }
  },
  (obj) => {
    switch (obj.type) {
      case 'personType':
        return personType;
      case 'articleType':
        return articleType;
      /*
       default:
       return null;
       */
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

var {connectionType: articleConnection} =
  connectionDefinitions({nodeType: articleType});


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
    articlesAuthored: {
      type: articleConnection,
      args: connectionArgs,
      resolve: (person, args) =>
        connectionFromPromisedArray(
          resolveArrayData(person.getArticles()), args
        )
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
      description: 'People',
      type: personConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveArrayByClass(Person), args)
    },
    peopleWithMethods: {
      description: 'People with methods',
      type: personConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(resolveArrayByClass(Person, true), args)
    },
    articles: {
      description: 'Articles',
      type: articleConnection,
      args: connectionArgs,
      resolve: (root, args) =>
        connectionFromPromisedArray(
          resolveModelsByClass(Article), args
        )
    },
    node: nodeField
  })
});


describe('test relay connections with sequelize', () => {


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
    it('returns a promised array', async () => {
      sequelizeArray = await getModelsByClass(Person);
      expect(sequelizeArray).to.be.a('array');
    });

    it('returns promised array with dataValues property. ', async () => {
      sequelizeArray = await getModelsByClass(Person);
      expect(sequelizeArray[0]).to.have.property('dataValues');
    });

    describe('getArrayData(sequelizeArray) => consumableArray', () => {

      let consumableArray;
      it('returns a promise that resolves to ' +
        'consumable array', async () => {
        consumableArray = await getArrayData(sequelizeArray);
        expect(consumableArray).to.be.an('array');

      });

      it('resolves to consumable data', () => {

        // remove dates from the array
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
  describe('resolveModelsByClass : sequelizeArgs', () => {
    let queriedArray;
    it('sorts ascending', async () => {
      queriedArray = await resolveModelsByClass(Person, {
        order: 'givenName ASC'});
      expect(queriedArray).to.be.a('array');
      let expected = [
        'Adrienne',
        'Aiyana',
        'Amir',
        'Berta',
        'Bobbie',
        'Eleonore',
        'Genoveva',
        'Gracie',
        'Jaylan',
        'Jennie'
      ];
      let actual = queriedArray.map(item => {
        return item.dataValues.givenName;
      });
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('getModelsByClass : sequelizeArgs', () => {
    let queriedArray;
    it('sorts ascending', async () => {
      queriedArray = await getModelsByClass(Person, {
        order: 'givenName ASC'});
      expect(queriedArray).to.be.a('array');
      let expected = [
        'Adrienne',
        'Aiyana',
        'Amir',
        'Berta',
        'Bobbie',
        'Eleonore',
        'Genoveva',
        'Gracie',
        'Jaylan',
        'Jennie'
      ];
      let actual = queriedArray.map(item => {
        return item.dataValues.givenName;
      });
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('getModelsByClass(Article) => sequelizeArray', () => {

    let sequelizeArray;
    it('returns a promised array', async () => {
      sequelizeArray = await getModelsByClass(Person);
      expect(sequelizeArray).to.be.a('array');
    });

    it('returns promised array with dataValues property. ', async () => {
      sequelizeArray = await getModelsByClass(Article);
      expect(sequelizeArray[0]).to.have.property('dataValues');
    });

    describe('getArrayData(sequelizeArray) => consumableArray', () => {

      let consumableArray;
      it('returns a promise that resolves to ' +
        'consumable array', async () => {
        consumableArray = await getArrayData(sequelizeArray);
        expect(consumableArray).to.be.an('array');

      });

      it('resolves to consumable data', () => {

        // remove dates from the array
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
            type: 'articleType',
            id: 1,
            articleBody: 'Ut et qui blanditiis laboriosam omnis.\n' +
            'Aut assumenda quis eum necessitatibus incidunt.\n' +
            'Necessitatibus quo consequatur facere nostrum optio et ' +
            'distinctio vel.\nDelectus ut quis.\n \rQuos laborum fuga nisi ' +
            'illo tempore ' +
            'aut quia facilis molestiae.\nAut ut id et et officiis officia ' +
            'consequuntur dolorem eos.\nQuia in fuga qui illum ut voluptates ' +
            'sed.\nUt sint ipsa dicta id repudiandae quibusdam.\n' +
            'Eos est perspiciatis dolor distinctio rem reprehenderit illum ' +
            'hic.\n \rSit voluptates ratione quis numquam necessitatibus ' +
            'omnis officia autem.\nDistinctio asperiores molestiae.\nAliquam ' +
            'asperiores fuga.\nNesciunt architecto quia sed.',
            articleSection: 'e-tailers',
            headline: 'Team-oriented 24/7 artificial intelligence',
            thumbnailUrl: 'http://lorempixel.com/640/480/business',
            AuthorId: 1 },
          { type: 'articleType',
            id: 2,
            articleBody: 'Enim optio quod.\nVelit asperiores ut aut enim ' +
            'quibusdam cum.\nIste magni iure est quia ut natus et occaecati ' +
            'laboriosam.\n \rEnim harum nostrum voluptas a ea.\nLaudantium ' +
            'sed enim est et.\nUnde ipsa ducimus fuga quia dolor facilis.\n' +
            'Excepturi quis pariatur qui.\nEt optio laudantium praesentium ' +
            'ipsa quis.\nEarum id sed.\n \rQuia ab repellendus et molestias ' +
            'explicabo.\nExplicabo quo non quia.\nSit fugiat minus magnam ' +
            'omnis voluptates non non.\nA ipsam et debitis.\nEa sit unde ' +
            'voluptatem atque voluptatem.\nLibero iusto aliquid amet.',
            articleSection: 'action-items',
            headline: 'Open-source object-oriented approach',
            thumbnailUrl: 'http://lorempixel.com/640/480/business',
            AuthorId: 2 },
          { type: 'articleType',
            id: 3,
            articleBody: 'Sunt impedit modi fugit fugiat quo.\nQui et sed ' +
            'maxime quaerat et laboriosam eaque.\nDolorem voluptatem hic ' +
            'facere voluptates.\nDeserunt et enim voluptas ipsa in possimus ' +
            'voluptates non.\n \rRem et veniam eum cupiditate beatae ' +
            'tenetur voluptatem incidunt quis.\nLabore ut fugit eos debitis ' +
            'possimus ipsa.\nPlaceat voluptas et enim.\n \rQui nemo dicta ' +
            'rem enim magnam doloribus cumque.\nDolore quos quo aut magni ' +
            'ipsam.\nEum ab et quis laudantium rem distinctio aliquam.\nId ' +
            'ex quaerat est sapiente et officiis aut expedita.\nQuis quidem ' +
            'atque illum temporibus eos nulla sint voluptatibus.\nSit iusto ' +
            'facilis porro id earum voluptatem explicabo temporibus autem.',
            articleSection: 'niches',
            headline: 'Managed content-based task-force',
            thumbnailUrl: 'http://lorempixel.com/640/480/business',
            AuthorId: 3 },
          { type: 'articleType',
            id: 4,
            articleBody: 'Sit expedita est.\nSoluta quia rerum eum qui ' +
            'libero voluptas illo.\nAut nihil quasi quisquam iure voluptates' +
            ' enim at.\nEt voluptatem excepturi perferendis totam.\nNihil ' +
            'aliquam iusto ut nihil autem natus quae eveniet.\nEx omnis a' +
            'nimi expedita consequatur debitis quasi natus sit neque.\n ' +
            '\rEsse sint veniam perspiciatis placeat.\nVoluptas veniam o' +
            'ccaecati illum unde magnam in.\nEt natus ab delectus quasi ' +
            'neque.\n \rOfficia quia provident consequatur debitis labor' +
            'um ullam consequuntur sint.\nFuga libero ratione.\nIllum ut' +
            ' eius nostrum voluptatem delectus saepe pariatur tempore.',
            articleSection: 'e-business',
            headline: 'Horizontal systematic function',
            thumbnailUrl: 'http://lorempixel.com/640/480/business',
            AuthorId: 4 },
          { type: 'articleType',
            id: 5,
            articleBody: 'Necessitatibus id quod et.\nDolores qui cupidit' +
            'ate natus consequatur quia ut ducimus.\nAtque quia quis anim' +
            'i consequatur aut.\nQuis ut sed nihil omnis fuga blanditiis.' +
            '\nAliquam commodi voluptatum molestias placeat quod quam ear' +
            'um.\nQui autem et nulla laborum.\n \rAccusamus voluptates id' +
            ' quia fugit et aut et.\nRem totam nesciunt quos esse ducimus' +
            ' tempore non et dolorum.\nRerum id eum reprehenderit harum q' +
            'uia.\nDelectus non cumque ipsa optio et.\nAccusantium sed do' +
            'lores.\n \rFuga qui ut voluptatem tempore mollitia similique' +
            ' quasi nesciunt aperiam.\nEt eum accusantium aspernatur harum' +
            ' et est.\nIllum quibusdam nobis laboriosam temporibus fugit m' +
            'olestiae numquam recusandae.\nEa maxime laudantium doloremque' +
            ' assumenda quas officiis repudiandae corrupti et.\nNon tempo' +
            'ra ad ut atque quae.\nQuam sunt sequi et voluptatem sapiente' +
            ' voluptate.',
            articleSection: 'e-business',
            headline: 'Quality-focused 24/7 attitude',
            thumbnailUrl: 'http://lorempixel.com/640/480/business',
            AuthorId: 5 },
          { type: 'articleType',
            id: 6,
            articleBody: 'Et accusantium magnam quia voluptate ex.\nAssum' +
            'enda pariatur est omnis blanditiis est totam.\nSoluta facili' +
            's tenetur ut temporibus sit quo atque.\nDolores aut non sint' +
            ' reiciendis ut.\n \rAut quo quaerat ab.\nNihil et quia ipsa ' +
            'accusamus omnis.\nAut occaecati maxime.\n \rSed ea et ab eiu' +
            's reiciendis voluptas dolore rem.\nOmnis iste et id ipsam et ' +
            'facilis voluptatem minima et.\nFacilis perspiciatis asperior' +
            'es sit temporibus delectus explicabo adipisci molestiae.',
            articleSection: 'interfaces',
            headline: 'Multi-tiered transitional encryption',
            thumbnailUrl: 'http://lorempixel.com/640/480/business',
            AuthorId: 6 },
          { type: 'articleType',
            id: 7,
            articleBody: 'Quisquam ab impedit.\nSaepe earum natus occaec' +
            'ati id doloremque hic rem.\nInventore voluptatum consequatu' +
            'r ea sed eum est nihil eaque.\nRem et minus.\nAutem iste cor' +
            'poris quasi.\n \rMinus asperiores perspiciatis.\nFuga labor' +
            'um possimus quis magni.\nBeatae aut odit quidem ea.\nId inci' +
            'dunt ea.\n \rQuia dolor quos iusto est ut.\nLaborum totam vo' +
            'luptatem expedita tempora enim alias explicabo in.\nQuis eos' +
            ' aspernatur ut molestias ullam qui minus maxime.\nAliquid re' +
            'm odio enim dolore perspiciatis voluptates.',
            articleSection: 'synergies',
            headline: 'Profound exuding productivity',
            thumbnailUrl: 'http://lorempixel.com/640/480/business',
            AuthorId: 7 },
          { type: 'articleType',
            id: 8,
            articleBody: 'Vel ea praesentium quibusdam.\nAutem explicabo' +
            ' eum.\nError illo tenetur.\nAccusamus et rerum rerum in quia' +
            '.\nDolorem quibusdam ea quasi voluptatem tenetur quaerat com' +
            'modi labore.\nAutem sed excepturi itaque molestiae ipsam.\n ' +
            '\rTempore alias possimus qui commodi aliquam officia.\nQuo ex' +
            'ercitationem ut laudantium commodi eum quisquam amet nam iure' +
            '.\nNobis sapiente est iste expedita quis amet quisquam vero f' +
            'uga.\nDolor voluptas est error porro non odio nihil quae.\n ' +
            '\rEos optio minima tempora officiis.\nSunt consequuntur ullam' +
            ' et est.\nVoluptatem dolor dolores.',
            articleSection: 'infrastructures',
            headline: 'Customer-focused coherent emulation',
            thumbnailUrl: 'http://lorempixel.com/640/480/business',
            AuthorId: 8 },
          { type: 'articleType',
            id: 9,
            articleBody: 'Architecto ea minima et qui sed delectus quibu' +
            'sdam ratione.\nEnim est possimus magnam quia.\nIpsam fugiat ' +
            'sit itaque odio praesentium neque assumenda id ex.\nEt qui e' +
            't modi dolorum alias voluptatum.\n \rAccusantium nostrum fa' +
            'cilis enim.\nAnimi omnis molestiae.\nSuscipit qui fugit dele' +
            'ctus necessitatibus et beatae sint.\nAliquid aspernatur aut' +
            'em.\n \rAtque maxime cum laboriosam eum omnis esse rerum re' +
            'prehenderit ut.\nCupiditate quae ut.\nDoloribus animi elige' +
            'ndi consequatur asperiores sed delectus qui.\nVoluptatem es' +
            't deleniti nostrum quia qui et.',
            articleSection: 'platforms',
            headline: 'Reduced explicit collaboration',
            thumbnailUrl: 'http://lorempixel.com/640/480/business',
            AuthorId: 9 },
          { type: 'articleType',
            id: 10,
            articleBody: 'Eos alias sint cum voluptates sit.\nVoluptatib' +
            'us voluptas adipisci illum.\nQui corrupti eveniet facere en' +
            'im consequatur similique.\nQui omnis porro molestiae et eni' +
            'm consequatur quam ea.\nEos qui enim.\nFuga necessitatibus ' +
            'delectus sunt eum ut ducimus.\n \rPariatur nihil magnam mol' +
            'estias ab dolor doloremque voluptas.\nEsse possimus et dolo' +
            'r aperiam.\nId tempora et maxime ducimus ipsa.\nDistinctio' +
            ' repudiandae occaecati in consequuntur non voluptate.\nIll' +
            'um voluptates voluptatem corporis impedit nobis.\n \rItaque' +
            ' ullam autem earum.\nSed iusto ab aut et quia.\nCum aut imp' +
            'edit dolor nobis culpa non pariatur.\nNam harum praesentium' +
            ' et quidem et ut cumque beatae rerum.\nLaborum non assumend' +
            'a voluptas ea totam.\nMaxime itaque voluptatem.',
            articleSection: 'methodologies',
            headline: 'Seamless tertiary structure',
            thumbnailUrl: 'http://lorempixel.com/640/480/business',
            AuthorId: 10
          }
        ];
        expect(theArray).to.deep.equal(expected);
      });


    });


  });

  describe('conversion to relay specification', () => {
    it('can handle errors', (done) => {
      var query = `
      query ukQuery {
        node(id: "aaa=") {
          id
          ... on Foo {
          id
        }
      }`;
      var expected = {
        errors: [
          {
            message: 'Syntax Error GraphQL request (8:8) Expected Name, ' +
            'found EOF\n\n7:         }\n8:       }\n          ^\n'
          }
        ]
      };
      graphql(schema, query).then((theResponse) => {
        expect(theResponse).to.deep.equal(expected);
        done();
      }).catch(done);
    });
    describe('resolveArrayByClass(Person)', () => {

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
        }).catch(done);
      });

      it('can get next page', (done) => {
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
                    address: '60340 Gleason Heights'
                  }
                }
              ]
            }
          }
        };
        graphql(schema, query).then((theResponse) => {
          expect(theResponse).to.deep.equal(expected);
          done();
        }).catch(done);
      });

      it('can get previous page', (done) => {
        var query = `
        {
          people(last: 2, before: "YXJyYXljb25uZWN0aW9uOjM=") {
            pageInfo {
              startCursor
              hasPreviousPage
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
                startCursor: 'YXJyYXljb25uZWN0aW9uOjE=',
                hasPreviousPage: true
              },
              edges: [
                {
                  cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
                  node: {
                    id: 'UGVyc29uOjI=',
                    givenName: 'Amir',
                    familyName: 'Schmeler',
                    address: '197 Mina Gardens'
                  }
                },
                {
                  cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
                  node: {
                    id: 'UGVyc29uOjM=',
                    givenName: 'Bobbie',
                    familyName: 'Adams',
                    address: '109 Ottilie Pass'
                  }
                }
              ]
            }
          }
        };
        graphql(schema, query).then((theResponse) => {
          expect(theResponse).to.deep.equal(expected);
          done();
        }).catch(done);
      });

      it('can perform refetch', (done) => {
        var query = `
      query PersonRefetchQuery {
        node(id: "UGVyc29uOjI=") {
          id
          ... on Person {
            id
            honorificPrefix
            givenName
            familyName
            honorificSuffix
            jobTitle
            telephone
            email
            address
          }
        }
      }`;
        var expected = {
          data: {
            node: {
              id: 'UGVyc29uOjI=',
              email: 'Creola5@gmail.com',
              honorificPrefix: 'Miss',
              honorificSuffix: 'DVM',
              jobTitle: 'Lead Creative Executive',
              telephone: '718-964-7388 x29503',
              givenName: 'Amir',
              familyName: 'Schmeler',
              address: '197 Mina Gardens'
            }
          }
        };
        graphql(schema, query).then((theResponse) => {
          expect(theResponse).to.deep.equal(expected);
          done();
        }).catch(done);
      });

    });

    describe('resolveArrayByClass(Person, true) With Methods', () => {

      it('has connection and edge fields', (done) => {
        var query = `
        {
          peopleWithMethods(first: 2) {
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
            peopleWithMethods: {
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
        }).catch(done);
      });

      it('can get next page', (done) => {
        var query = `
        {
          peopleWithMethods(first: 2, after: "YXJyYXljb25uZWN0aW9uOjE") {
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
            peopleWithMethods: {
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
                    address: '60340 Gleason Heights'
                  }
                }
              ]
            }
          }
        };
        graphql(schema, query).then((theResponse) => {
          expect(theResponse).to.deep.equal(expected);
          done();
        }).catch(done);
      });

      it('can get previous page', (done) => {
        var query = `
        {
          peopleWithMethods(last: 2, before: "YXJyYXljb25uZWN0aW9uOjM=") {
            pageInfo {
              startCursor
              hasPreviousPage
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
            peopleWithMethods: {
              pageInfo: {
                startCursor: 'YXJyYXljb25uZWN0aW9uOjE=',
                hasPreviousPage: true
              },
              edges: [
                {
                  cursor: 'YXJyYXljb25uZWN0aW9uOjE=',
                  node: {
                    id: 'UGVyc29uOjI=',
                    givenName: 'Amir',
                    familyName: 'Schmeler',
                    address: '197 Mina Gardens'
                  }
                },
                {
                  cursor: 'YXJyYXljb25uZWN0aW9uOjI=',
                  node: {
                    id: 'UGVyc29uOjM=',
                    givenName: 'Bobbie',
                    familyName: 'Adams',
                    address: '109 Ottilie Pass'
                  }
                }
              ]
            }
          }
        };
        graphql(schema, query).then((theResponse) => {
          expect(theResponse).to.deep.equal(expected);
          done();
        }).catch(done);
      });

    });


    describe('resolveArrayData(person.getArticles())', () => {
      it('can get authored posts', (done) => {
        var query = `
      query PersonRefetchQuery {
        node(id: "UGVyc29uOjI=") {
          id
          ... on Person {
            id
            givenName
            familyName
            address
            articlesAuthored {
              edges {
                node {
                  id
                  headline
                  thumbnailUrl
                }
              }
            }
          }
        }
      }`;
        var expected = {
          data: {
            node: {
              id: 'UGVyc29uOjI=',
              givenName: 'Amir',
              familyName: 'Schmeler',
              address: '197 Mina Gardens',
              articlesAuthored: {
                edges: [
                  {
                    node: {
                      id: 'QXJ0aWNsZToy',
                      headline: 'Open-source object-oriented approach',
                      thumbnailUrl: 'http://lorempixel.com/640/480/business'
                    }
                  }
                ]
              }
            }
          }
        };
        graphql(schema, query).then((theResponse) => {
          expect(theResponse).to.deep.equal(expected);
          done();
        }).catch(done);
      });
    });

    describe('resolveModelsByClass(Article)', () => {

      it('has connection and edge fields', (done) => {
        var query = `
        {
          articles(first: 2) {
            pageInfo {
              startCursor
              hasNextPage
            }
            edges {
              node {
                id
                headline,
                articleBody,
                articleSection,
                headline,
                thumbnailUrl
              }
            }
          }
        }`;
        var expected = {
          data: {
            articles: {
              pageInfo: {
                hasNextPage: true,
                startCursor: 'YXJyYXljb25uZWN0aW9uOjA='
              },
              edges: [
                {
                  node: {
                    articleBody: 'Ut et qui blanditiis laboriosam omnis.\nA' +
                    'ut assumenda quis eum necessitatibus incidunt.\nNecess' +
                    'itatibus quo consequatur facere nostrum optio et disti' +
                    'nctio vel.\nDelectus ut quis.\n \rQuos laborum fuga ni' +
                    'si illo tempore aut quia facilis molestiae.\nAut ut id' +
                    ' et et officiis officia consequuntur dolorem eos.\nQui' +
                    'a in fuga qui illum ut voluptates sed.\nUt sint ipsa d' +
                    'icta id repudiandae quibusdam.\nEos est perspiciatis d' +
                    'olor distinctio rem reprehenderit illum hic.\n \rSit v' +
                    'oluptates ratione quis numquam necessitatibus omnis of' +
                    'ficia autem.\nDistinctio asperiores molestiae.\nAliqua' +
                    'm asperiores fuga.\nNesciunt architecto quia sed.',
                    articleSection: 'e-tailers',
                    headline: 'Team-oriented 24/7 artificial intelligence',
                    id: 'QXJ0aWNsZTox',
                    thumbnailUrl: 'http://lorempixel.com/640/480/business'
                  }
                },
                {
                  node: {
                    articleBody: 'Enim optio quod.\nVelit asperiores ut aut' +
                    ' enim quibusdam cum.\nIste magni iure est quia ut natu' +
                    's et occaecati laboriosam.\n \rEnim harum nostrum volu' +
                    'ptas a ea.\nLaudantium sed enim est et.\nUnde ipsa duc' +
                    'imus fuga quia dolor facilis.\nExcepturi quis pariatur' +
                    ' qui.\nEt optio laudantium praesentium ipsa quis.\nEar' +
                    'um id sed.\n \rQuia ab repellendus et molestias explic' +
                    'abo.\nExplicabo quo non quia.\nSit fugiat minus magnam' +
                    ' omnis voluptates non non.\nA ipsam et debitis.\nEa si' +
                    't unde voluptatem atque voluptatem.\nLibero iusto aliq' +
                    'uid amet.',
                    articleSection: 'action-items',
                    headline: 'Open-source object-oriented approach',
                    id: 'QXJ0aWNsZToy',
                    thumbnailUrl: 'http://lorempixel.com/640/480/business'
                  }
                }
              ]
            }
          }
        };
        graphql(schema, query).then((theResponse) => {
          expect(theResponse).to.deep.equal(expected);
          done();
        }).catch(done);
      });
      it('has authors', (done) => {
        var query = `
        {
          articles(first: 2) {
            pageInfo {
              startCursor
              hasNextPage
            }
            edges {
              node {
                id
                headline,
                articleBody,
                articleSection,
                headline,
                thumbnailUrl
                author {
                  id
                  givenName
                }
              }
            }
          }
        }`;
        var expected = {
          data: {
            articles: {
              pageInfo: {
                hasNextPage: true,
                startCursor: 'YXJyYXljb25uZWN0aW9uOjA='
              },
              edges: [
                {
                  node: {
                    articleBody: 'Ut et qui blanditiis laboriosam omnis.\nA' +
                    'ut assumenda quis eum necessitatibus incidunt.\nNecess' +
                    'itatibus quo consequatur facere nostrum optio et disti' +
                    'nctio vel.\nDelectus ut quis.\n \rQuos laborum fuga ni' +
                    'si illo tempore aut quia facilis molestiae.\nAut ut id' +
                    ' et et officiis officia consequuntur dolorem eos.\nQui' +
                    'a in fuga qui illum ut voluptates sed.\nUt sint ipsa d' +
                    'icta id repudiandae quibusdam.\nEos est perspiciatis d' +
                    'olor distinctio rem reprehenderit illum hic.\n \rSit v' +
                    'oluptates ratione quis numquam necessitatibus omnis of' +
                    'ficia autem.\nDistinctio asperiores molestiae.\nAliqua' +
                    'm asperiores fuga.\nNesciunt architecto quia sed.',
                    articleSection: 'e-tailers',
                    headline: 'Team-oriented 24/7 artificial intelligence',
                    id: 'QXJ0aWNsZTox',
                    thumbnailUrl: 'http://lorempixel.com/640/480/business',
                    author: {
                      givenName: 'Jaylan',
                      id: 'UGVyc29uOjE='
                    }
                  }
                },
                {
                  node: {
                    articleBody: 'Enim optio quod.\nVelit asperiores ut aut' +
                    ' enim quibusdam cum.\nIste magni iure est quia ut natu' +
                    's et occaecati laboriosam.\n \rEnim harum nostrum volu' +
                    'ptas a ea.\nLaudantium sed enim est et.\nUnde ipsa duc' +
                    'imus fuga quia dolor facilis.\nExcepturi quis pariatur' +
                    ' qui.\nEt optio laudantium praesentium ipsa quis.\nEar' +
                    'um id sed.\n \rQuia ab repellendus et molestias explic' +
                    'abo.\nExplicabo quo non quia.\nSit fugiat minus magnam' +
                    ' omnis voluptates non non.\nA ipsam et debitis.\nEa si' +
                    't unde voluptatem atque voluptatem.\nLibero iusto aliq' +
                    'uid amet.',
                    articleSection: 'action-items',
                    headline: 'Open-source object-oriented approach',
                    id: 'QXJ0aWNsZToy',
                    thumbnailUrl: 'http://lorempixel.com/640/480/business',
                    author: {
                      givenName: 'Amir',
                      id: 'UGVyc29uOjI='
                    }
                  }
                }
              ]
            }
          }
        };
        graphql(schema, query).then((theResponse) => {
          expect(theResponse).to.deep.equal(expected);
          done();
        }).catch(done);
      });
      it('can perform refetch', (done) => {
        var query = `
          query ArticleRefetchQuery {
            node(id: "QXJ0aWNsZToy") {
              id
              ... on Article {
                id
                headline
              }
            }
          }`;
        var expected = {
          data: {
            node: {
              id: 'QXJ0aWNsZToy',
              headline: 'Open-source object-oriented approach'
            }
          }
        };
        graphql(schema, query).then((theResponse) => {
          expect(theResponse).to.deep.equal(expected);
          done();
        }).catch(done);
      });
      it('can get the author', (done) => {
        var query = `
          query ArticleRefetchQuery {
            node(id: "QXJ0aWNsZToy") {
              id
              ... on Article {
                id
                headline
                author {
                  id
                  givenName
                }
              }
            }
          }`;
        var expected = {
          data: {
            node: {
              id: 'QXJ0aWNsZToy',
              headline: 'Open-source object-oriented approach',
              author: {
                givenName: 'Amir',
                id: 'UGVyc29uOjI='
              }
            }
          }
        };
        graphql(schema, query).then((theResponse) => {
          expect(theResponse).to.deep.equal(expected);
          done();
        }).catch(done);
      });
    });

  });

});




