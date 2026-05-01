import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';
import type { Model } from 'condition-ui-editor/routes/products/dashboard';
import type Controller from 'condition-ui-editor/controllers/products/dashboard';
import ProductsDashboardFilters from 'condition-ui-editor/components/products/dashboard-filters.gts';

interface DashboardSignature {
  Args: {
    model: Model;
    controller: Controller;
  };
}

<template>
  {{pageTitle "Dashboard"}}

  <ProductsDashboardFilters
    @filters={{@controller.filters}}
    @onChange={{@controller.onFiltersChange}}
    @properties={{@model.properties}}
  />

  {{outlet}}
</template> satisfies TOC<DashboardSignature>;
