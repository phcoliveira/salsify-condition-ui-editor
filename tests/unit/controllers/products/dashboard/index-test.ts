import { module, test } from 'qunit';
import { setupTest } from 'condition-ui-editor/tests/helpers';

module('Unit | Controller | products/dashboard/index', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    const controller = this.owner.lookup('controller:products/dashboard/index');
    assert.ok(controller);
  });
});
