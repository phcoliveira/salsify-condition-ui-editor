import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';
import type { Model } from 'condition-ui-editor/routes/products/dashboard';
import type Controller from 'condition-ui-editor/controllers/products/dashboard';
import DashboardFilters from 'condition-ui-editor/components/products/dashboard-filters.gts';

interface DashboardSignature {
  Args: {
    model: Model;
    controller: Controller;
  };
}

<template>
  {{pageTitle "Dashboard"}}

  <DashboardFilters
    @filters={{@controller.filters}}
    @onChange={{@controller.onFiltersChange}}
    @properties={{@model.properties}}
  />

  <div class="py-6">
    {{outlet}}
  </div>
</template> satisfies TOC<DashboardSignature>;
