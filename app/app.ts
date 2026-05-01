import Application from '@ember/application';
import setupInspector from '@embroider/legacy-inspector-support/ember-source-4.12';
import { importSync, isDevelopingApp, macroCondition } from '@embroider/macros';
import compatModules from '@embroider/virtual/compat-modules';
import config from 'condition-ui-editor/config/environment';
import 'condition-ui-editor/styles/app.css';
import loadInitializers from 'ember-load-initializers';
import Resolver from 'ember-resolver';

if (macroCondition(isDevelopingApp())) {
  importSync('./deprecation-workflow');
}

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
  inspector = setupInspector(this);
}

loadInitializers(App, config.modulePrefix, compatModules);
