import { operatorsByType } from 'condition-ui-editor/services/datastore';
import { setupTest } from 'condition-ui-editor/tests/helpers';
import type {
  Operator,
  Product,
  Property,
} from 'condition-ui-editor/types/datastore';
import { module, test } from 'qunit';
import sinon from 'sinon';

const ALL_OPERATORS: Operator[] = [
  { id: 'any', text: 'Any' },
  { id: 'contains', text: 'Contains' },
  { id: 'equals', text: 'Equals' },
  { id: 'greater_than', text: 'Greater than' },
  { id: 'in', text: 'In' },
  { id: 'less_than', text: 'Less than' },
  { id: 'none', text: 'None' },
];

module('Unit | Service | datastore', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const service = this.owner.lookup('service:datastore');
    assert.ok(service);
  });

  module('getAllProperties', function () {
    test('returns all properties', function (assert) {
      const service = this.owner.lookup('service:datastore');
      const properties: Property[] = [
        { id: 1, name: 'Color', type: 'enumerated', values: ['Red', 'Green'] },
        { id: 2, name: 'Price', type: 'number' },
      ];
      // @ts-expect-error - stubbing private property
      sinon.stub(service, 'allProperties').value(properties);
      assert.deepEqual(service.getAllProperties(), properties);
    });
  });

  module('getProducts', function () {
    test('returns all products', function (assert) {
      const service = this.owner.lookup('service:datastore');
      const products: Product[] = [
        { id: 1, property_values: [{ property_id: 1, value: 'Red' }] },
      ];
      // @ts-expect-error - stubbing private property
      sinon.stub(service, 'allProducts').value(products);
      assert.deepEqual(service.getProducts(null), products);
    });
  });

  module('getOperators', function (hooks) {
    hooks.beforeEach(function () {
      const service = this.owner.lookup('service:datastore');
      // @ts-expect-error - stubbing private property
      sinon.stub(service, 'allOperators').value(ALL_OPERATORS);
    });

    test('returns the operators for string properties', function (assert) {
      const service = this.owner.lookup('service:datastore');
      const ids = service
        .getOperators('string')
        .map((op) => op.id)
        .sort();
      assert.deepEqual(ids, operatorsByType.string.sort());
    });

    test('returns the operators for number properties', function (assert) {
      const service = this.owner.lookup('service:datastore');
      const ids = service
        .getOperators('number')
        .map((op) => op.id)
        .sort();
      assert.deepEqual(ids, operatorsByType.number.sort());
    });

    test('returns the operators for enumerated properties', function (assert) {
      const service = this.owner.lookup('service:datastore');
      const ids = service
        .getOperators('enumerated')
        .map((op) => op.id)
        .sort();
      assert.deepEqual(ids, operatorsByType.enumerated.sort());
    });
  });
});
