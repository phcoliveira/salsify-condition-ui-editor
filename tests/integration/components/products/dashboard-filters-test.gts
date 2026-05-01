import { module, test } from 'qunit';
import { setupRenderingTest } from 'condition-ui-editor/tests/helpers';
import { click, fillIn, find, render } from '@ember/test-helpers';
import Service from '@ember/service';
import DashboardFilters, {
  type FiltersFormSchema,
} from 'condition-ui-editor/components/products/dashboard-filters';
import type { Property } from 'condition-ui-editor/types/datastore';

const STRING_PROPERTY: Property = {
  id: 1,
  name: 'Product Name',
  type: 'string',
};
const NUMBER_PROPERTY: Property = { id: 2, name: 'Weight', type: 'number' };
const ENUMERATED_PROPERTY: Property = {
  id: 3,
  name: 'Category',
  type: 'enumerated',
  values: ['tools', 'electronics'],
};

const NO_PROPERTIES: Property[] = [];
const STRING_PROPERTIES: Property[] = [STRING_PROPERTY];
const NUMBER_PROPERTIES: Property[] = [NUMBER_PROPERTY];
const ENUMERATED_PROPERTIES: Property[] = [ENUMERATED_PROPERTY];
const MIXED_PROPERTIES: Property[] = [STRING_PROPERTY, NUMBER_PROPERTY];

class MockDatastoreService extends Service {
  getOperators(type: Property['type']) {
    const operators: Record<Property['type'], { id: string; text: string }[]> =
      {
        string: [{ id: 'contains', text: 'Contains' }],
        number: [{ id: 'greater_than', text: 'Greater than' }],
        enumerated: [{ id: 'in', text: 'In' }],
      };

    return operators[type] ?? [];
  }
}

const emptyFilters: FiltersFormSchema = {
  propertyId: undefined,
  operatorId: undefined,
  stringValue: undefined,
  numberValue: undefined,
  enumeratedValue: undefined,
};

const po = {
  clear: '[data-test-products-dashboard-filters="clear"]',
  enumeratedValue: '[data-test-products-dashboard-filters="enumeratedValue"]',
  numberValue: '[data-test-products-dashboard-filters="numberValue"]',
  operatorId: '[data-test-products-dashboard-filters="operatorId"]',
  propertyId: '[data-test-products-dashboard-filters="propertyId"]',
  stringValue: '[data-test-products-dashboard-filters="stringValue"]',
};

module(
  'Integration | Component | products/dashboard-filters',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.owner.register('service:datastore', MockDatastoreService);
    });

    test('it renders a "Select a property" dropdown with the provided properties', async function (assert) {
      await render(
        <template>
          <DashboardFilters
            @filters={{emptyFilters}}
            @properties={{MIXED_PROPERTIES}}
          />
        </template>,
      );

      const propertyIdElement = find(po.propertyId)!;

      await click(propertyIdElement);

      assert.dom('[data-key="1"]', propertyIdElement).hasText('Product Name');
      assert.dom('[data-key="2"]', propertyIdElement).hasText('Weight');
    });

    test('it renders a Clear button', async function (assert) {
      await render(
        <template>
          <DashboardFilters
            @filters={{emptyFilters}}
            @properties={{NO_PROPERTIES}}
          />
        </template>,
      );

      assert.dom(po.clear).hasText('Clear');
    });

    test('it does not render an operator selector when no property is selected', async function (assert) {
      await render(
        <template>
          <DashboardFilters
            @filters={{emptyFilters}}
            @properties={{STRING_PROPERTIES}}
          />
        </template>,
      );

      assert.dom(po.operatorId).doesNotExist();
    });

    test('it does not render a value input when no operator is selected', async function (assert) {
      const filters = { ...emptyFilters, propertyId: '1' };

      await render(
        <template>
          <DashboardFilters
            @filters={{filters}}
            @properties={{STRING_PROPERTIES}}
          />
        </template>,
      );

      assert.dom(po.enumeratedValue).doesNotExist();
      assert.dom(po.numberValue).doesNotExist();
      assert.dom(po.stringValue).doesNotExist();
    });

    module('given a selected operator — string property', function () {
      const filters = {
        ...emptyFilters,
        propertyId: '1',
        operatorId: 'contains',
      };

      test('it renders a text input', async function (assert) {
        await render(
          <template>
            <DashboardFilters
              @filters={{filters}}
              @properties={{STRING_PROPERTIES}}
            />
          </template>,
        );

        assert.dom(po.enumeratedValue).doesNotExist();
        assert.dom(po.numberValue).doesNotExist();
        assert.dom(po.stringValue).isVisible();
      });

      test('typing in the text input calls onChange with slowInput=true', async function (assert) {
        let capturedFilters: FiltersFormSchema | undefined;
        let capturedSlowInput: boolean | undefined;

        function onChange(f: FiltersFormSchema, slowInput: boolean) {
          capturedFilters = f;
          capturedSlowInput = slowInput;
        }

        await render(
          <template>
            <DashboardFilters
              @filters={{filters}}
              @properties={{STRING_PROPERTIES}}
              @onChange={{onChange}}
            />
          </template>,
        );

        await fillIn(po.stringValue, 'hello');

        assert.strictEqual(capturedFilters?.stringValue, 'hello');
        assert.true(capturedSlowInput);
      });
    });

    module('given a selected operator — number property', function () {
      const filters = {
        ...emptyFilters,
        propertyId: '2',
        operatorId: 'greater_than',
      };

      test('it renders a number input', async function (assert) {
        await render(
          <template>
            <DashboardFilters
              @filters={{filters}}
              @properties={{NUMBER_PROPERTIES}}
            />
          </template>,
        );

        assert.dom(po.enumeratedValue).doesNotExist();
        assert.dom(po.numberValue).isVisible();
        assert.dom(po.stringValue).doesNotExist();
      });

      test('typing in the number input calls onChange with slowInput=true', async function (assert) {
        let capturedFilters: FiltersFormSchema | undefined;
        let capturedSlowInput: boolean | undefined;

        function onChange(f: FiltersFormSchema, slowInput: boolean) {
          capturedFilters = f;
          capturedSlowInput = slowInput;
        }

        await render(
          <template>
            <DashboardFilters
              @filters={{filters}}
              @properties={{NUMBER_PROPERTIES}}
              @onChange={{onChange}}
            />
          </template>,
        );

        await fillIn(po.numberValue, '42');

        assert.strictEqual(capturedFilters?.numberValue, '42');
        assert.true(capturedSlowInput);
      });
    });

    module('given a selected operator — enumerated property', function () {
      const filters = { ...emptyFilters, propertyId: '3', operatorId: 'in' };

      test('it renders a multi-select with the property values', async function (assert) {
        await render(
          <template>
            <DashboardFilters
              @filters={{filters}}
              @properties={{ENUMERATED_PROPERTIES}}
            />
          </template>,
        );

        const enumeratedValueElement = find(po.enumeratedValue)!;

        assert.dom('[data-key="tools"]', enumeratedValueElement).exists();
        assert.dom('[data-key="electronics"]', enumeratedValueElement).exists();
      });

      test('selecting values calls onChange with slowInput=true', async function (assert) {
        let capturedFilters: FiltersFormSchema | undefined;
        let capturedSlowInput: boolean | undefined;

        function onChange(f: FiltersFormSchema, slowInput: boolean) {
          capturedFilters = f;
          capturedSlowInput = slowInput;
        }

        await render(
          <template>
            <DashboardFilters
              @filters={{filters}}
              @properties={{ENUMERATED_PROPERTIES}}
              @onChange={{onChange}}
            />
          </template>,
        );

        await click(`${po.enumeratedValue} [data-test-id="trigger"]`);
        await click('[data-test-id="listbox-item"][data-key="tools"]');

        assert.deepEqual(capturedFilters?.enumeratedValue, ['tools']);
        assert.true(capturedSlowInput);
      });
    });

    test('selecting a property calls onChange and resets operator and value', async function (assert) {
      let capturedFilters: FiltersFormSchema | undefined;

      function onChange(f: FiltersFormSchema) {
        capturedFilters = f;
      }

      await render(
        <template>
          <DashboardFilters
            @filters={{emptyFilters}}
            @properties={{MIXED_PROPERTIES}}
            @onChange={{onChange}}
          />
        </template>,
      );

      await click(`${po.propertyId} [data-test-id="trigger"]`);
      await click(`[data-test-id="listbox-item"][data-key="1"]`);

      assert.deepEqual(capturedFilters, {
        propertyId: '1',
        operatorId: undefined,
        enumeratedValue: undefined,
        numberValue: undefined,
        stringValue: undefined,
      });
    });

    test('selecting an operator calls onChange while keeping the current value', async function (assert) {
      let capturedFilters: FiltersFormSchema | undefined;

      function onChange(f: FiltersFormSchema) {
        capturedFilters = f;
      }

      // stringValue is in the filter state even when not visible in the UI
      const filters = {
        ...emptyFilters,
        propertyId: '1',
        stringValue: 'hello',
      };

      await render(
        <template>
          <DashboardFilters
            @filters={{filters}}
            @properties={{STRING_PROPERTIES}}
            @onChange={{onChange}}
          />
        </template>,
      );

      await click(`${po.operatorId} [data-test-id="trigger"]`);
      await click('[data-test-id="listbox-item"][data-key="contains"]');

      assert.deepEqual(capturedFilters, {
        propertyId: '1',
        operatorId: 'contains',
        enumeratedValue: undefined,
        numberValue: undefined,
        stringValue: 'hello',
      });
    });

    test('clicking Clear calls onChange with all filters undefined', async function (assert) {
      let capturedFilters: FiltersFormSchema | undefined;

      function onChange(f: FiltersFormSchema) {
        capturedFilters = f;
      }

      const filters = {
        ...emptyFilters,
        propertyId: '1',
        operatorId: 'contains',
        stringValue: 'hello',
      };

      await render(
        <template>
          <DashboardFilters
            @filters={{filters}}
            @properties={{STRING_PROPERTIES}}
            @onChange={{onChange}}
          />
        </template>,
      );

      await click(po.clear);

      assert.deepEqual(capturedFilters, {
        propertyId: undefined,
        operatorId: undefined,
        enumeratedValue: undefined,
        numberValue: undefined,
        stringValue: undefined,
      });
    });
  },
);
