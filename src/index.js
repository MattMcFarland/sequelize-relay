require('babel-core/register');
require('babel-polyfill');

export {
  getArrayData,
  getModelsByClass,
  resolveArrayByClass,
  resolveArrayData,
  resolveModelsByClass
} from './data/methods';
