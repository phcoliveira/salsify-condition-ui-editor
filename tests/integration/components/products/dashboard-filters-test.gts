import { module, test } from 'qunit';
import { setupRenderingTest } from 'condition-ui-editor/tests/helpers';
import { render } from '@ember/test-helpers';
import DashboardFilters from 'condition-ui-editor/components/products/dashboard-filters';
import type { Property } from 'condition-ui-editor/types/datastore';

module('Integration | Component | products/dashboard-filters', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Updating values is achieved using autotracking, just like in app code. For example:
    // class State { @tracked myProperty = 0; }; const state = new State();
    // and update using state.myProperty = 1; await rerender();
    // Handle any actions with function myAction(val) { ... };

    const mockProperties: Property[] = [];
    const initialFilters = {
      propertyId: undefined,
      operatorId: undefined,
      stringValue: undefined,
      numberValue: undefined,
      enumeratedValue: undefined,
    };

    await render(<template>
      <DashboardFilters
        @filters={{initialFilters}}
        @properties={{mockProperties}}
      />
    </template>);

    assert.dom().exists();

    // Template block usage:
    await render(<template>
      <DashboardFilters
        @filters={{initialFilters}}
        @properties={{mockProperties}}
      >
        template block text
      </DashboardFilters>
    </template>);

    assert.dom().hasText('template block text');
  });
});
