import { module, test } from 'qunit';
import { setupTest } from 'condition-ui-editor/tests/helpers';

module('Unit | Controller | products/dashboard', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    const controller = this.owner.lookup('controller:products/dashboard');
    assert.ok(controller);
  });
});
