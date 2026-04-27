import type { TOC } from '@ember/component/template-only';
import { LinkTo } from '@ember/routing';
import { pageTitle } from 'ember-page-title';

interface IndexSignature {
  Args: {
    model: unknown;
    controller: unknown;
  };
}

<template>
  {{pageTitle "Index"}}

  <p>Solution by
    <a
      href="https://www.linkedin.com/in/oliveira-phc"
      target="_blank"
      rel="noopener noreferrer"
    >Paulo H. C. de Oliveira</a></p>

  {{! This resolves to the route `application.products.dashboard.index`. }}
  <LinkTo @route="products">Click here to see the products</LinkTo>
</template> satisfies TOC<IndexSignature>;
