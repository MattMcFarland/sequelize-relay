process.env.NODE_ENV = 'development';

const _ = require('lodash');
const faker = require('faker');
export const models = require('./models/index');

const seedDatabase = () => {
  var { Person } = models;
  return new Promise((resolve) => {
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
            resolve();
          }
        });
      });
    });
  });
};

export const connect = () => {
  return new Promise((resolve, reject) => {
    try {
      models.sequelize.sync().then(() => {
        return seedDatabase().then(() => {
          resolve(models);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};
