# API Methods

* [getArrayData](getArrayData.md) -
Converts an `Array` of SequelizeModel instances to an `Array` of Attributes
objects.

* [getModelsByClass](getModelsByClass.md) -
Returns an `Array` of SequelizeModel instances that are of the
passed-in SequelizeClass.

* [resolveArrayByClass](resolveArrayByClass.md) -
First, it internally resolves an an `Array` of SequelizeModel instances
that are of the passed-in SequelizeClass. Then it converts the array
into a **promised** `Array` of <Attributes> objects.

* [resolveArrayData](resolveArrayData.md) - Converts a **promised** `Array`
of SequelizeModel instances into a **promised** `Array` of Attributes objects.

* [resolveModelsByClass](resolveModelsByClass.md) - Returns a **promised**
`Array` of SequelizeModel objects by `SequelizeClass`.