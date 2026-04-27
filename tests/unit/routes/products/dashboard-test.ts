import { module, test } from 'qunit';
import { setupTest } from 'condition-ui-editor/tests/helpers';

module('Unit | Route | products/dashboard', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:products/dashboard');
    assert.ok(route);
  });
});
