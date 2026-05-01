import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';

interface ApplicationSignature {
  Args: {
    model: unknown;
    controller: unknown;
  };
}

/**
 * The application template is the root of the template hierarchy. It is always
 * rendered and its route is always active, even when generated automatically by
 * the lack of the file `app/routes/application.(js|ts)`.
 */
<template>
  {{pageTitle "Condition UI Editor"}}

  <main class="min-w-2xl max-w-4/5 mx-auto">
    {{outlet}}
  </main>
</template> satisfies TOC<ApplicationSignature>;
