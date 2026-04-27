import Route from '@ember/routing/route';
import { service, type Registry } from '@ember/service';

export type QueryParamSlug = 'operator' | 'property' | 'property_value';

type QueryParams = Record<
  QueryParamSlug,
  {
    refreshModel?: boolean;
    replace?: boolean;
    as?: string;
  }
>;

type Params = Record<QueryParamSlug, string | undefined>;

export type Model = Readonly<{
  products: ReturnType<Registry['datastore']['getProducts']>;
}>;

export default class ProductsDashboardIndexRoute extends Route<Model> {
  @service()
  declare readonly datastore: Registry['datastore'];

  /**
   * These query params refresh the model because they are directly used to
   * filter the listed products.
   *
   * The usage of the option `replace` is a personal UX decision. I deliberately
   * planned to have the products table at this route, instead of simply putting
   * it in the landing page, to demonstrate this functionality.
   *
   * Because of this, the user can alter the filter many times without pushing a
   * new item to the HistoryState. In other words, pressing the back button of
   * the browser will lead the user right back to the landing page because each
   * new filter replaces the previous one.
   *
   * Too often designers and PMs do not think about that while creating new
   * features. In a working scenario, I would ask them to stay for 5 minutes
   * after the daily standup to discuss this decision.
   */
  queryParams: QueryParams = {
    operator: {
      refreshModel: true,
      replace: true,
    },
    property: {
      refreshModel: true,
      replace: true,
    },
    property_value: {
      refreshModel: true,
      replace: true,
    },
  };

  /**
   * I intentionally used query params as a means to preserve the state of the
   * filter, which would enable users to simply share a URL for seeing the same
   * dashboard in other devices.
   */
  model(params: Params) {
    return {
      products: this.datastore.getProducts(params),
    };
  }
}
