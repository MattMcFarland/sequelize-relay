
/**
 * Returns a promise that will resolve into an array by using the Model class
 * static findAll method.
 */
export const getModelsByClass = (model) => {
  return model.findAll();
};


/**
 * Returns a new promise containing a new array with only consumable data.
 */
export const getArrayData = (models) => {
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
 */
export const getArrayByClass = (model) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(getArrayData(getModelsByClass(model)));
    } catch (error) {
      reject(error);
    }
  });
};


/**
 * Returns an array of Models by using the Model class static findAll method.
 */
export const resolveModelsByClass = async (model) => {
  return await model.findAll();
};


/**
 * Returns a new array containing only consumable data from a model array.
 * @param models Array<Model>
 * @returns Array<Object>
 */
export const resolveArrayData = (models) => {
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


/**
 * Returns a new array containing only consumable data from a model Class.
 * @param model
 * @returns Array<Object>
 */
export const resolveArrayByClass = async (model) => {

  let models = await resolveModelsByClass(model);
  return resolveArrayData(models);

};
