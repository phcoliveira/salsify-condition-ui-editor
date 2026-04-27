import { setApplication } from '@ember/test-helpers';
import Application from 'condition-ui-editor/app';
import config from 'condition-ui-editor/config/environment';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
import setupSinon from 'ember-sinon-qunit';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';

export function start() {
  setApplication(Application.create(config.APP));

  setup(QUnit.assert);
  setupEmberOnerrorValidation();

  setupSinon();
  qunitStart();
}
