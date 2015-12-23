/**
 * Module Dependencies
 */
import _ from 'lodash';
import faker from 'faker';
import { expect } from 'chai';
import { describe, it, before } from 'mocha';
import { models, connect } from '../../sequelize';

describe('Database', () => {
  let db;
  before((done) => {
    connect().then((_db) => {
      done();
      db = _db;
    });
  });

  it('connects to the database', (done) => {
    expect(db).to.not.be.an('undefined');
    done();
  });

  it('seeds database', (done) => {
    var { Person } = models;
    return _.times(10, (i) => {
      return Person.create({
        additionalName: faker.name.firstName(),
        address: faker.address.streetAddress(),
        email: faker.internet.email(),
        familyName: faker.name.lastName(),
        givenName: faker.name.firstName(),
        honorificPrefix: faker.name.prefix(),
        honorificSuffix: faker.name.suffix(),
        jobTitle: faker.name.jobTitle(),
        telephone: faker.phone.phoneNumber()
      }).then((person) => {
        return person.createArticle({
          articleBody: faker.lorem.paragraphs(),
          articleSection: faker.company.bsNoun(),
          headline: faker.company.catchPhrase(),
          thumbnailUrl: faker.image.business()
        }).then(() => {
          if (i === 9) {
            done();
          }
        }).catch(err => console.error(err));
      }).catch(err => console.error(err));
    });
  });
});
