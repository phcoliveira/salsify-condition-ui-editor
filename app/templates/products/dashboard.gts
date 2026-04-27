import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';
import type { Model } from 'condition-ui-editor/routes/products/dashboard';
import type Controller from 'condition-ui-editor/controllers/products/dashboard';

interface DashboardSignature {
  Args: {
    model: Model;
    controller: Controller;
  };
}

function stringify(object: unknown) {
  return JSON.stringify(object);
}

<template>
  {{pageTitle "Dashboard"}}

  <p>{{stringify @model.properties}}</p>

  {{outlet}}
</template> satisfies TOC<DashboardSignature>;
