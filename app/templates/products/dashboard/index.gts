import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';
import type { Model } from 'condition-ui-editor/routes/products/dashboard/index';
import type Controller from 'condition-ui-editor/controllers/products/dashboard/index';
import ProductsTable from 'condition-ui-editor/components/products/products-table.gts';

interface IndexSignature {
  Args: {
    model: Model;
    controller: Controller;
  };
}

<template>
  {{pageTitle "Index"}}

  <ProductsTable
    @properties={{@model.properties}}
    @products={{@model.products}}
  />
</template> satisfies TOC<IndexSignature>;
