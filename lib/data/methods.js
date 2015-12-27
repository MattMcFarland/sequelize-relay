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
 * Converts an array of <SequelizeModel> instances to an array of <Attributes>
 * objects.
 * @param instances
 * @param withMethods {Boolean} false by default.
 * @returns {Array.<Attributes>}
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
 * Returns an `Array` of
 * <SequelizeModel> instances that are of the passed-in `Class`.
 * @param SeqClass
 * @returns {Array.<SequelizeModel>}
 */
function getModelsByClass(SeqClass) {
  return SeqClass.findAll();
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

var resolveArrayByClass = exports.resolveArrayByClass = (function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(SeqClass) {
    var withMethods = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var models;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return resolveModelsByClass(SeqClass);

          case 2:
            models = _context.sent;
            return _context.abrupt("return", getArrayData(models, withMethods));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function resolveArrayByClass(_x2, _x3) {
    return ref.apply(this, arguments);
  };
})();

/**
 * Converts a promised  `Array` of <SequelizeModel> instances into a
 * **promised** `Array` of <Attributes> objects.
 * @param instances
 * @param withMethods {Boolean} false by default.
 * @returns {Promise<Array<Attributes>>}
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
 * Returns a **promised** `Array` of <Attributes> objects by `Class`.
 *
 * @param SeqClass
 * @returns {Promise<Array<SequelizeModel>>}
 */

var resolveModelsByClass = exports.resolveModelsByClass = (function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(SeqClass) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return SeqClass.findAll();

          case 2:
            return _context2.abrupt("return", _context2.sent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function resolveModelsByClass(_x6) {
    return ref.apply(this, arguments);
  };
})();