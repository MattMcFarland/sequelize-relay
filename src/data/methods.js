/* @flow */

type SeqModelClass = {
  findAll: Function
}

type ConsumableData = Object;

type SeqModelInstance = {
  type: String,
  dataValues: ConsumableData
}



/**
 * Returns an array of sequelize model instances.
 */
export function getModelsByClass(
  className: SeqModelClass
): Array<SeqModelInstance> {
  return className.findAll();
}


/**
 * Takes a an array of sequelize model instances and converts them
 * into a promised array of consumable data.
 */
export function getArrayData(
  instances: Array<SeqModelInstance>
): Array<ConsumableData> {
  return resolveArrayData(instances);
}

/**
 * Takes a Sequelize Model Class and returns the sequelize-model
 * instances of that class.
 */
export function getArrayByClass(
  className: SeqModelClass
): Promise<Array<SeqModelInstance>> {
  return new Promise((resolve, reject) => {
    try {
      resolve(getArrayData(getModelsByClass(className)));
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Returns an array of sequelize model instances by using the sequelize
 * model class findAll method.
 */

export async function resolveModelsByClass(
  className: SeqModelClass
): Promise<Array<SeqModelInstance>> {
  return await className.findAll();
}


/**
 * Converts Array offset sequelize model instances into an array of
 * consumable data.
 */
export function resolveArrayData(
  instances: Array<SeqModelInstance>
): Array<ConsumableData> {
  let array = instances.map(model => {
    return Object.assign({}, {
        type: model.type
      }, {
        ...model.dataValues
      }
    );
  });
  return [].concat(...array);
}


/**
 * Returns a new array containing only consumable data from a model Class.
 */
export async function resolveArrayByClass(
  className: SeqModelClass
): Promise<Array<ConsumableData>> {

  let models = await resolveModelsByClass(className);
  return resolveArrayData(models);

}

