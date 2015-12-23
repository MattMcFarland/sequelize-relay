export const models = require('./models/index');
export const connect = () => models.sequelize.sync();
