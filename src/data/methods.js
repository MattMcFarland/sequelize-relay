/* @flow */

declare class Model {
  findAll: () => Promise;
  dataValues: Object;
  type: String;
}


/**
 * Returns a promise that will resolve into an array by using the Model class
 * static findAll method.
 * @param model {Model}
 * @returns {Promise<Array<Model>>}
 */
export const getModelsByClass = (model: Model): Promise => {
  return model.findAll();
};


/**
 * Returns a new promise containing a new array with only consumable data.
 * @param models {Array<Model>}
 * @returns {Promise<Array<Model>>}
 */
export const getArrayData = (models: Array<Model>):
  Promise<Array<Model>> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(resolveArrayData(models));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Returns a promise that will resolve into a relay-compatible array of the
 * given Model Class.
 * @param model {Model}
 * @returns {Promise<Array<Model>>}
 */
export const getArrayByClass = (model: Model):
  Promise<Array<Object>> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(getArrayData(getModelsByClass(model)));
    } catch (error) {
      reject(error);
    }
  });
};



/**
 * Returns a new array containing only consumable data from a model array.
 * @param models Array<Model>
 * @returns Array<Object>
 */
export const resolveArrayData = (models: Array<Model>):
  Array<Object> => {
  let array = models.map(model => {
    return Object.assign({}, {
        type: model.type
      }, {
        ...model.dataValues
      }
    );
  });
  return [].concat(...array);
};

