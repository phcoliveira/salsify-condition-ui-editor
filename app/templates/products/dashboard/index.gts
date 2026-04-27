import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';
import type { Model } from 'condition-ui-editor/routes/products/dashboard/index';
import type Controller from 'condition-ui-editor/controllers/products/dashboard/index';

interface IndexSignature {
  Args: {
    model: Model;
    controller: Controller;
  };
}

function stringify(object: unknown) {
  return JSON.stringify(object);
}

<template>
  {{pageTitle "Index"}}

  <p>{{stringify @model.products}}</p>

  {{outlet}}
</template> satisfies TOC<IndexSignature>;
