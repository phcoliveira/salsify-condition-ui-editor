import type { Params } from 'condition-ui-editor/routes/products/dashboard';
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

const STRING_PROPERTY_ID = 1;
const NUMBER_PROPERTY_ID = 2;
const ENUMERATED_PROPERTY_ID = 3;

// Products 1–3 have all three properties. Product 4 has no enumerated value,
// which lets us test `any`/`none` against a property that some products lack.
const PRODUCTS: Product[] = [
  {
    id: 1,
    property_values: [
      { property_id: STRING_PROPERTY_ID, value: 'Headphones' },
      { property_id: NUMBER_PROPERTY_ID, value: 5 },
      { property_id: ENUMERATED_PROPERTY_ID, value: 'electronics' },
    ],
  },
  {
    id: 2,
    property_values: [
      { property_id: STRING_PROPERTY_ID, value: 'Cell Phone' },
      { property_id: NUMBER_PROPERTY_ID, value: 3 },
      { property_id: ENUMERATED_PROPERTY_ID, value: 'electronics' },
    ],
  },
  {
    id: 3,
    property_values: [
      { property_id: STRING_PROPERTY_ID, value: 'Hammer' },
      { property_id: NUMBER_PROPERTY_ID, value: 19 },
      { property_id: ENUMERATED_PROPERTY_ID, value: 'tools' },
    ],
  },
  {
    id: 4,
    property_values: [
      { property_id: STRING_PROPERTY_ID, value: 'Cup' },
      { property_id: NUMBER_PROPERTY_ID, value: 3 },
    ],
  },
];

function params(overrides: Partial<Params> = {}): Params {
  return {
    propertyId: undefined,
    operatorId: undefined,
    stringValue: undefined,
    numberValue: undefined,
    enumeratedValue: undefined,
    ...overrides,
  };
}

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

  module('getProducts', function (hooks) {
    hooks.beforeEach(function () {
      const service = this.owner.lookup('service:datastore');
      // @ts-expect-error - stubbing private property
      sinon.stub(service, 'allProducts').value(PRODUCTS);
    });

    test('when propertyId is undefined, returns all products', function (assert) {
      const service = this.owner.lookup('service:datastore');

      assert.deepEqual(
        service.getProducts(params({ operatorId: 'equals' })),
        PRODUCTS,
      );
    });

    test('when operatorId is undefined, returns all products', function (assert) {
      const service = this.owner.lookup('service:datastore');

      assert.deepEqual(
        service.getProducts(params({ propertyId: STRING_PROPERTY_ID })),
        PRODUCTS,
      );
    });

    module('operator: any', function () {
      test('includes products that have a value for the property', function (assert) {
        const service = this.owner.lookup('service:datastore');

        assert.deepEqual(
          service.getProducts(
            params({ propertyId: ENUMERATED_PROPERTY_ID, operatorId: 'any' }),
          ),
          [PRODUCTS[0], PRODUCTS[1], PRODUCTS[2]],
        );
      });

      test('excludes products that have no value for the property', function (assert) {
        const service = this.owner.lookup('service:datastore');

        const result = service.getProducts(
          params({ propertyId: ENUMERATED_PROPERTY_ID, operatorId: 'any' }),
        );

        assert.notOk(result.includes(PRODUCTS[3]!));
      });
    });

    module('operator: none', function () {
      test('includes products that have no value for the property', function (assert) {
        const service = this.owner.lookup('service:datastore');

        assert.deepEqual(
          service.getProducts(
            params({ propertyId: ENUMERATED_PROPERTY_ID, operatorId: 'none' }),
          ),
          [PRODUCTS[3]],
        );
      });

      test('excludes products that have a value for the property', function (assert) {
        const service = this.owner.lookup('service:datastore');

        const result = service.getProducts(
          params({ propertyId: ENUMERATED_PROPERTY_ID, operatorId: 'none' }),
        );

        assert.notOk(result.includes(PRODUCTS[0]!));
      });
    });

    module('operator: equals', function () {
      test('string: includes products with an exact match', function (assert) {
        const service = this.owner.lookup('service:datastore');

        assert.deepEqual(
          service.getProducts(
            params({
              propertyId: STRING_PROPERTY_ID,
              operatorId: 'equals',
              stringValue: 'Headphones',
            }),
          ),
          [PRODUCTS[0]],
        );
      });

      test('string: excludes products that differ only by case', function (assert) {
        const service = this.owner.lookup('service:datastore');

        assert.deepEqual(
          service.getProducts(
            params({
              propertyId: STRING_PROPERTY_ID,
              operatorId: 'equals',
              stringValue: 'headphones',
            }),
          ),
          [],
        );
      });

      test('number: includes products with an exact match', function (assert) {
        const service = this.owner.lookup('service:datastore');

        assert.deepEqual(
          service.getProducts(
            params({
              propertyId: NUMBER_PROPERTY_ID,
              operatorId: 'equals',
              numberValue: 5,
            }),
          ),
          [PRODUCTS[0]],
        );
      });

      test('enumerated: includes products whose value is in the selected set', function (assert) {
        const service = this.owner.lookup('service:datastore');

        assert.deepEqual(
          service.getProducts(
            params({
              propertyId: ENUMERATED_PROPERTY_ID,
              operatorId: 'equals',
              enumeratedValue: ['electronics'],
            }),
          ),
          [PRODUCTS[0], PRODUCTS[1]],
        );
      });
    });

    module('operator: contains', function () {
      test('includes products whose string value contains the substring', function (assert) {
        const service = this.owner.lookup('service:datastore');

        assert.deepEqual(
          service.getProducts(
            params({
              propertyId: STRING_PROPERTY_ID,
              operatorId: 'contains',
              stringValue: 'phone',
            }),
          ),
          [PRODUCTS[0], PRODUCTS[1]],
        );
      });

      test('is case-insensitive', function (assert) {
        const service = this.owner.lookup('service:datastore');

        assert.deepEqual(
          service.getProducts(
            params({
              propertyId: STRING_PROPERTY_ID,
              operatorId: 'contains',
              stringValue: 'PHONE',
            }),
          ),
          [PRODUCTS[0], PRODUCTS[1]],
        );
      });
    });

    module('operator: greater_than', function () {
      test('includes products whose number value exceeds the filter value', function (assert) {
        const service = this.owner.lookup('service:datastore');

        assert.deepEqual(
          service.getProducts(
            params({
              propertyId: NUMBER_PROPERTY_ID,
              operatorId: 'greater_than',
              numberValue: 5,
            }),
          ),
          [PRODUCTS[2]],
        );
      });

      test('excludes products whose number value equals the filter value', function (assert) {
        const service = this.owner.lookup('service:datastore');

        const result = service.getProducts(
          params({
            propertyId: NUMBER_PROPERTY_ID,
            operatorId: 'greater_than',
            numberValue: 5,
          }),
        );

        assert.notOk(result.includes(PRODUCTS[0]!));
      });
    });

    module('operator: less_than', function () {
      test('includes products whose number value is below the filter value', function (assert) {
        const service = this.owner.lookup('service:datastore');

        assert.deepEqual(
          service.getProducts(
            params({
              propertyId: NUMBER_PROPERTY_ID,
              operatorId: 'less_than',
              numberValue: 5,
            }),
          ),
          [PRODUCTS[1], PRODUCTS[3]],
        );
      });

      test('excludes products whose number value equals the filter value', function (assert) {
        const service = this.owner.lookup('service:datastore');

        const result = service.getProducts(
          params({
            propertyId: NUMBER_PROPERTY_ID,
            operatorId: 'less_than',
            numberValue: 5,
          }),
        );

        assert.notOk(result.includes(PRODUCTS[0]!));
      });
    });

    module('operator: in', function () {
      test('enumerated: includes products whose value is one of the selected values', function (assert) {
        const service = this.owner.lookup('service:datastore');

        assert.deepEqual(
          service.getProducts(
            params({
              propertyId: ENUMERATED_PROPERTY_ID,
              operatorId: 'in',
              enumeratedValue: ['electronics', 'tools'],
            }),
          ),
          [PRODUCTS[0], PRODUCTS[1], PRODUCTS[2]],
        );
      });

      test('enumerated: excludes products whose value is not among the selected values', function (assert) {
        const service = this.owner.lookup('service:datastore');

        assert.deepEqual(
          service.getProducts(
            params({
              propertyId: ENUMERATED_PROPERTY_ID,
              operatorId: 'in',
              enumeratedValue: ['tools'],
            }),
          ),
          [PRODUCTS[2]],
        );
      });
    });

    test('when the operator requires a value but none is provided, returns no products', function (assert) {
      const service = this.owner.lookup('service:datastore');

      assert.deepEqual(
        service.getProducts(
          params({ propertyId: STRING_PROPERTY_ID, operatorId: 'equals' }),
        ),
        [],
      );
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
