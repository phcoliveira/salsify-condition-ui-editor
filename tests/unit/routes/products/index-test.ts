import { module, test } from 'qunit';
import { setupTest } from 'condition-ui-editor/tests/helpers';

module('Unit | Route | products/index', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:products/index');
    assert.ok(route);
  });
});
