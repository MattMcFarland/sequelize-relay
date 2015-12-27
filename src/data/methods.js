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
 * Converts an array of sequelize-models instances into a simple
 * array of consumable data. You lose all methods.
 * @param instances
 * @param withMethods {Boolean} false by default.
 * @returns {Array.<ConsumableData>}
 */
export function getArrayData(
  instances: Array<SeqModelInstance>,
  withMethods: boolean = false
): Array<ConsumableData> {

  if (withMethods) {
    return [].concat(...instances);
  } else {
    return [].concat(instances.map(model => {
      return Object.assign({}, {
        type: model.type
      }, {
        ...model.dataValues
      });
    }));
  }
}


/**
 * Returns an array of sequelize model instances by the class name being
 * passed into it.
 * @param className
 * @returns {Array.<SeqModelInstance>}
 */
export function getModelsByClass(
  className: SeqModelClass
): Array<SeqModelInstance> {
  return className.findAll();
}


/**
 * Takes a an array of sequelize-model instances and converts them
 * into a promised array of consumable data.
 * @param instances
 * @param withMethods {Boolean} false by default.
 * @returns {Promise<Array<ConsumableData>>}
 */
export function resolveArrayData(
  instances: Promise<Array<SeqModelInstance>>,
  withMethods: boolean = false
): Promise<Array<ConsumableData>> {
  return new Promise((resolve, reject) => {
    instances.then((models) => {
      resolve(getArrayData(models, withMethods));
    }).catch(reject);
  });
}


/**
 * Returns a a promised array of consumable sequelize model instances by the
 * class name being passed into it.
 *
 * @param className
 * @returns {Promise<Array<SeqModelInstance>>}
 */
export async function resolveModelsByClass(
  className: SeqModelClass
): Promise<Array<SeqModelInstance>> {
  return await className.findAll();
}


/**
 * Returns a new promised array containing only consumable data from a model
 * Class.
 * @param className
 * @param withMethods {Boolean} false by default.
 * @returns {Array.<ConsumableData>}
 */
export async function resolveArrayByClass(
  className: SeqModelClass,
  withMethods: boolean = false
): Promise<Array<ConsumableData>> {

  let models = await resolveModelsByClass(className);
  return getArrayData(models, withMethods);

}

