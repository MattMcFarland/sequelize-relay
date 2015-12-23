/**
 * Retrieve list from model
 * @param model
 * @returns {Promise}
 */
export const getAll = (model) => {
  return model.findAll();
};



/**
 * Convert sequelize dblist to mappedArray
 * @param dblist
 * @returns {Promise}
 */
export const mappedArray = (dblist): Promise => {
  return new Promise((resolve, reject) => {
    try {
      dblist.then(listItems => {
        resolve([].concat(...listItems));
      });
    } catch (error) {
      reject(error);
    }
  });
};

