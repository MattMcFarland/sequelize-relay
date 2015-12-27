## getArrayData ⇒ `Array<Attributes>`
**getArrayData(`instances`, `withMethods`) ⇒ `Array<Attributes>`**

**Description:** Converts an `Array` of <SequelizeModel> instances to an `Array` of <Attributes> objects.


**Returns**: Array`<`Attributes`>`


<table>
<thead><tr><th>Param</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td>instances</td><td>Array</td><td>An array of <SequelizeModel> instances</td></tr>
<tr><td>withMethods</td><td>Boolean <code>default: false</code></td><td>If true, the <Attributes> objects wil also contain the get/set methods from the <SequelizeModel></td></tr>
</tbody>
</table>

----


### Module Import
```javascript
    import { getArrayData } from 'sequelize-relay';
```


The `getArrayData` and [resolveArrayData](resolveArrayData.md) methods are very similar as they both return
an Array of Attributes objects.  The difference is `resolveArrayData` expects a **promised**
Attributes `Array`, but the `getArrayData` method expects an Attributes `Array`.

### Examples
*For more information about how sequelize models work, [click here](http://docs.sequelizejs.com/en/latest/docs/models-definition/).*

```javascript
var User = sequelize.define('user', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING
});

User.sync({force: true}).then(function () {
  // Table created
  return User.create({
    firstName: 'John',
    lastName: 'Hancock'
  });
});
```

Now let's pretend we created a few different Users and we wanted to retrieve a list, but only get their attributes.

> NOTE: Sequelize will automatically create helper functions and also pluralize Users in the db object.

```javascript
db.Users.findAll().then(function (users) => {
  console.log(users); // complex multi array with circular objects, etc. good for some use-cases.
  var justThePropsPlease = getArrayData(users); // flattened array like the SQL table.
  var propsAndMethods = getArrayData(users, true); // flattened array with only getters/setters excluding static methods.
});
```

Consider a `sequelize` model named `Person`:

```javascript
import { Person } from 'myDatabase';
import { getArrayData, getModelsByClass } from 'sequelize-relay';

async function getFlatArrayOfPeople () {
  let sequelizeArray = await getModelsByClass(Person);
  return getArrayData(sequelizeArray);
}
```