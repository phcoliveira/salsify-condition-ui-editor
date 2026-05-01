import Route from '@ember/routing/route';
import { service, type Registry } from '@ember/service';
import type { Params } from 'condition-ui-editor/routes/products/dashboard';

export type Model = Readonly<{
  products: ReturnType<Registry['datastore']['getProducts']>;
}>;

export default class ProductsDashboardIndexRoute extends Route<Model> {
  @service()
  declare readonly datastore: Registry['datastore'];

  model() {
    const params = this.paramsFor('products.dashboard') as Params;
    return {
      products: this.datastore.getProducts(params),
    };
  }
}
