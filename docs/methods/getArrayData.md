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


The `getArrayData` and <code>[resolveArrayData](resolveArrayData.md)</code> methods are very similar as they both return
an Array of Attributes objects.  The difference is `resolveArrayData` expects a **promised**
Attributes `Array`, but the `getArrayData` method expects an Attributes `Array`.

