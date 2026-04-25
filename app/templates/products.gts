import type { TOC } from '@ember/component/template-only';
import { pageTitle } from 'ember-page-title';

interface ProductsSignature {
  Args: {
    model: unknown;
    controller: unknown;
  };
}

/**
 * This route is the common layout for all the routes under `/products`, staying
 * active when visiting any of its child routes.
 * The aim here is to have a RESTful and flexible routing structure, as such:
 *
 * /products      => application.products.index
 * /products/1    => application.products.show
 * /products/new  => application.products.create
 *
 * Too often I have seen non-RESTful routes such as this:
 *
 * /products => application.products
 *
 * Such routing structure prevents the usage of a common, dedicated layout for
 * the products. Additional routes, such as `/products/new` and `/products/1`,
 * would be siblings of this route, instead of its children. They would require
 * manually declared URL paths in the route definitions, like this:
 *
 * this.route('products');
 * this.route('product', { path: '/products/:id' });
 * this.route('product-create', { path: '/products/new' });
 *
 * While it works, in most cases I consider it as an anti-pattern.
 */
<template>
  {{pageTitle "Products"}}

  <p>Products layout</p>

  {{outlet}}
</template> satisfies TOC<ProductsSignature>;
