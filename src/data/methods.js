/* @flow */

type SequelizeClass = {
  findAll: Function
}

type Attributes = Object;
type SequelizeModel = {
  type: String,
  dataValues: Attributes
}

/**
 * Converts an array of <SequelizeModel> instances to an array of <Attributes>
 * objects.
 * @param instances
 * @param withMethods {Boolean} false by default.
 * @returns {Array.<Attributes>}
 */
export function getArrayData(
  instances: Array<SequelizeModel>,
  withMethods: boolean = false
): Array<Attributes> {

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
 * Returns an `Array` of
 * <SequelizeModel> instances that are of the passed-in `Class`.
 * @param SeqClass
 * @param query // optional query object
 * @returns {Array.<SequelizeModel>}
 */
export function getModelsByClass(
  SeqClass: SequelizeClass,
  query: ?Object
): Array<SequelizeModel> {
  return query ? SeqClass.findAll(query) : SeqClass.findAll();
}



/**
 * First, it internally resolves an an `Array` of
 * <SequelizeModel> instances that are of the passed-in `Class`.
 * Then it converts the array into a **promised** `Array` of <Attributes>
 * objects.
 * @param SeqClass
 * @param withMethods {Boolean} false by default.
 * @returns {Array.<Attributes>}
 */
export function resolveArrayByClass(
  SeqClass: SequelizeClass,
  withMethods: boolean = false
): Promise<Array<Attributes>> {
  return new Promise((resolve, reject) => {
    resolveModelsByClass(SeqClass).then(m => {
      resolve(getArrayData(m, withMethods));
    }).catch(reject);
  });

}



/**
 * Converts a promised  `Array` of <SequelizeModel> instances into a
 * **promised** `Array` of <Attributes> objects.
 * @param instances
 * @param withMethods {Boolean} false by default.
 * @returns {Promise<Array<Attributes>>}
 */
export function resolveArrayData(
  instances: Promise<Array<SequelizeModel>>,
  withMethods: boolean = false
): Promise<Array<Attributes>> {
  return new Promise((resolve, reject) => {
    instances.then((models) => {
      resolve(getArrayData(models, withMethods));
    }).catch(reject);
  });
}


/**
 * Returns a **promised** `Array` of <Attributes> objects by `Class`.
 *
 * @param SeqClass
 * @param query // optional query object
 * @returns {Promise<Array<SequelizeModel>>}
 */
export function resolveModelsByClass(
  SeqClass: SequelizeClass,
  query: ?Object
): Promise<Array<SequelizeModel>> {
  return query ? SeqClass.findAll(query) : SeqClass.findAll();
}
