import { click, currentURL, fillIn, findAll, visit, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'condition-ui-editor/tests/helpers';
import { module, test } from 'qunit';

const po = {
  filters: {
    trigger: '[data-test-id="trigger"]',
    option: '[data-test-id="listbox-item"]',
    stringInput: '[data-test-products-dashboard-filters="stringValue"]',
  },
  loading: '[data-test-products-dashboard-index-loading="root"]',
  table: {
    cell: '[data-test-products-products-table="cell"]',
    column: '[data-test-products-products-table="column"]',
    row: '[data-test-products-products-table="row"]',
  },
}

module('Acceptance | products/filtering products', function (hooks) {
  setupApplicationTest(hooks);

  test('the products can be filtered', async function (assert) {
    await visit('/products');

    assert.strictEqual(currentURL(), '/products');

    const columns = findAll(po.table.column);

    assert.strictEqual(columns.length, 5);

    assert.dom(columns[0]).hasText('Product Name');
    assert.dom(columns[1]).hasText('color');
    assert.dom(columns[2]).hasText('weight (oz)');
    assert.dom(columns[3]).hasText('category');
    assert.dom(columns[4]).hasText('wireless');

    assert.dom(po.table.row).exists({ count: 6 });

    // Click on the first input: property
    await click(findAll(po.filters.trigger)[0]!);
    // Click on the second option: color
    await click(findAll(po.filters.option)[1]!);

    const urlPropertyParam = new URL(currentURL(), 'http://foo.bar');

    assert.true(urlPropertyParam.searchParams.has('property', '1'));

    // click on the second input: operator
    await click(findAll(po.filters.trigger)[1]!);
    // click on the fifth option: Contains
    await click(findAll(po.filters.option)[4]!);

    const urlOperatorParam = new URL(currentURL(), 'http://foo.bar');
    assert.true(urlOperatorParam.searchParams.has('property', '1'));
    assert.true(urlOperatorParam.searchParams.has('operator', 'contains'));

    // fill in the third input: stringValue
    await fillIn(po.filters.stringInput, 're');

    const urlStringValueParam = new URL(currentURL(), 'http://foo.bar');

    assert.true(urlStringValueParam.searchParams.has('property', '1'));
    assert.true(urlStringValueParam.searchParams.has('operator', 'contains'));
    assert.true(urlStringValueParam.searchParams.has('string', 're'));

    // Table is rendered
    await waitFor(po.table.row)

    assert.dom(po.table.row).exists({ count: 1 });

    assert
      .dom(findAll(po.table.cell)[1])
      .hasAttribute('data-property-id', '1')
      .hasText('grey')
  });
});
