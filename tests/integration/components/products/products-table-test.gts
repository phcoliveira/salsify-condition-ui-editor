import { module, test } from 'qunit';
import { setupRenderingTest } from 'condition-ui-editor/tests/helpers';
import { findAll, render } from '@ember/test-helpers';
import ProductsTable from 'condition-ui-editor/components/products/products-table';
import type { Product, Property } from 'condition-ui-editor/types/datastore';

const NAME_PROPERTY: Property = { id: 1, name: 'Name', type: 'string' };
const WEIGHT_PROPERTY: Property = { id: 2, name: 'Weight', type: 'number' };
const PROPERTIES: Property[] = [NAME_PROPERTY, WEIGHT_PROPERTY];

const PRODUCT_A: Product = {
  id: 1,
  property_values: [
    { property_id: 1, value: 'Widget' },
    { property_id: 2, value: 10 },
  ],
};
const PRODUCT_B: Product = {
  id: 2,
  property_values: [
    { property_id: 1, value: 'Gadget' },
    { property_id: 2, value: 20 },
  ],
};
const PRODUCT_SPARSE: Product = {
  id: 3,
  property_values: [{ property_id: 1, value: 'Sparse' }],
};

const NO_PRODUCTS: Product[] = [];

const po = {
  column: '[data-test-products-products-table="column"]',
  row: '[data-test-products-products-table="row"]',
  cell: '[data-test-products-products-table="cell"]',
};

module('Integration | Component | products/products-table', function (hooks) {
  setupRenderingTest(hooks);

  module('headers', function () {
    test('renders a column header for each property', async function (assert) {
      await render(
        <template>
          <ProductsTable @products={{NO_PRODUCTS}} @properties={{PROPERTIES}} />
        </template>,
      );

      assert.dom(po.column).exists({ count: 2 });
    });

    test('renders headers in the order properties are passed', async function (assert) {
      await render(
        <template>
          <ProductsTable @products={{NO_PRODUCTS}} @properties={{PROPERTIES}} />
        </template>,
      );

      const headers = findAll(po.column);

      assert.dom(headers[0]).hasText('Name');
      assert.dom(headers[1]).hasText('Weight');
    });
  });

  module('rows', function () {
    test('renders one row per product', async function (assert) {
      const products = [PRODUCT_B, PRODUCT_A];

      await render(
        <template>
          <ProductsTable @products={{products}} @properties={{PROPERTIES}} />
        </template>,
      );

      const rows = findAll(po.row);

      assert.strictEqual(rows.length, 2);
      assert.dom(rows[0]).hasAttribute('data-product-id', '2');
      assert.dom(rows[1]).hasAttribute('data-product-id', '1');
    });

    test('renders cell values aligned to the correct property column', async function (assert) {
      const products = [PRODUCT_A];

      await render(
        <template>
          <ProductsTable @products={{products}} @properties={{PROPERTIES}} />
        </template>,
      );

      const cells = findAll(po.cell);

      assert.dom(cells[0]).hasText('Widget');
      assert.dom(cells[1]).hasText('10');
    });

    test('renders an empty cell when a product has no value for a property', async function (assert) {
      const products = [PRODUCT_SPARSE];

      await render(
        <template>
          <ProductsTable @products={{products}} @properties={{PROPERTIES}} />
        </template>,
      );

      const cells = findAll(po.cell);

      assert.dom(cells[0]).hasText('Sparse');
      assert.dom(cells[1]).hasText('');
    });
  });
});
