"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getArrayData = getArrayData;
exports.getModelsByClass = getModelsByClass;
exports.resolveArrayData = resolveArrayData;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Converts an array of sequelize-models instances into a simple
 * array of consumable data. You lose all methods.
 * @param instances
 * @param withMethods {Boolean} false by default.
 * @returns {Array.<ConsumableData>}
 */
function getArrayData(instances) {
  var withMethods = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  if (withMethods) {
    var _ref;

    return (_ref = []).concat.apply(_ref, _toConsumableArray(instances));
  } else {
    return [].concat(instances.map(function (model) {
      return Object.assign({}, {
        type: model.type
      }, _extends({}, model.dataValues));
    }));
  }
}

/**
 * Returns an array of sequelize model instances by the class name being
 * passed into it.
 * @param className
 * @returns {Array.<SeqModelInstance>}
 */
function getModelsByClass(className) {
  return className.findAll();
}

/**
 * Takes a an array of sequelize-model instances and converts them
 * into a promised array of consumable data.
 * @param instances
 * @param withMethods {Boolean} false by default.
 * @returns {Promise<Array<ConsumableData>>}
 */
function resolveArrayData(instances) {
  var withMethods = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  return new Promise(function (resolve, reject) {
    instances.then(function (models) {
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

var resolveModelsByClass = exports.resolveModelsByClass = (function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(className) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return className.findAll();

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function resolveModelsByClass(_x3) {
    return ref.apply(this, arguments);
  };
})();

/**
 * Returns a new promised array containing only consumable data from a model
 * Class.
 * @param className
 * @param withMethods {Boolean} false by default.
 * @returns {Array.<ConsumableData>}
 */

var resolveArrayByClass = exports.resolveArrayByClass = (function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(className) {
    var withMethods = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var models;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return resolveModelsByClass(className);

          case 2:
            models = _context2.sent;
            return _context2.abrupt("return", getArrayData(models, withMethods));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function resolveArrayByClass(_x4, _x5) {
    return ref.apply(this, arguments);
  };
})();