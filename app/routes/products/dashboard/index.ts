import Route from '@ember/routing/route';
import { service, type Registry } from '@ember/service';
import { isTesting, macroCondition } from '@embroider/macros';
import type {
  Model as DashboardModel,
  Params as DashboardParams,
} from 'condition-ui-editor/routes/products/dashboard';

export type Model = Readonly<
  DashboardModel & {
    products: ReturnType<Registry['datastore']['getProducts']>;
  }
>;

export default class ProductsDashboardIndexRoute extends Route<Model> {
  @service()
  declare readonly datastore: Registry['datastore'];

  async model() {
    await new Promise((resolve) =>
      setTimeout(resolve, macroCondition(isTesting()) ? 1 : 500),
    );

    const params = this.paramsFor('products.dashboard') as DashboardParams;
    const dashboardModel = this.modelFor(
      'products.dashboard',
    ) as DashboardModel;

    return {
      ...dashboardModel,
      products: this.datastore.getProducts(params),
    };
  }
}
