/**
 * Person Model
 * @see https://schema.org/Person
 * @type {Model}
 */
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
