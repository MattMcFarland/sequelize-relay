export const models = require('./models/index');

export const connect = () => {
  return new Promise((resolve, reject) => {
    try {
      models.sequelize.sync().then(() => {
          resolve(models);
      });
    } catch (error) {
      reject(error);
    }
  });
};
