import Route from '@ember/routing/route';
import { service, type Registry } from '@ember/service';

export type Params = {
  operatorId: string | undefined;
  propertyId: number | undefined;
  stringValue: string | undefined;
  numberValue: number | undefined;
  enumeratedValue: string[] | undefined;
};

export type Model = Readonly<{
  properties: ReturnType<Registry['datastore']['getAllProperties']>;
}>;

export default class ProductsDashboardRoute extends Route<Model> {
  @service()
  declare readonly datastore: Registry['datastore'];

  /**
   * I intentionally used query params as a means to preserve the state of the
   * filter, which would enable users to simply share a URL for seeing the same
   * dashboard in other devices.
   *
   * The usage of the option `replace` is a personal UX decision. Because of
   * this, the user can alter the filter many times without pushing a new item
   * to the HistoryState. In other words, pressing the back button of the
   * browser will lead the user right back to the landing page because each
   * new filter replaces the previous one.
   *
   * Too often designers and PMs do not think about that while creating new
   * features. In a working scenario, I would ask them to stay for 5 minutes
   * after the daily standup to discuss this decision.
   */
  queryParams = {
    operatorId: {
      refreshModel: false,
      replace: true,
      as: 'operator',
    },
    propertyId: {
      refreshModel: false,
      replace: true,
      as: 'property',
    },
    stringValue: {
      refreshModel: false,
      replace: true,
      as: 'string',
    },
    numberValue: {
      refreshModel: false,
      replace: true,
      as: 'number',
    },
    enumeratedValue: {
      refreshModel: false,
      replace: true,
      as: 'enumerated',
    },
  };

  /**
   * According to Claude, the average number of properties varies between 80 and
   * 400. While numerous, it is reasonable to have them all loaded without
   * pagination, although I could be wrong.
   * https://claude.ai/share/304eb531-54e5-4f05-8b39-7123a143a64b
   *
   * Loading the properties here partially fulfills this requirement.
   * >  Properties and Products vary from customer to customer, you cannot
   * >  depend on having the same properties or products available each time
   * >  this application loads
   *
   * So they are not hardcoded as options of a select box, but dynamically
   * loaded.
   *
   * Furthermore, this model does not need to, and will not, be refreshed when
   * its child route "index" is refreshed.
   *
   * Having this dashboard route separated from its child index route might seem
   * to be over engineering, but it prevents these properties from being fetched
   * again along with the products.
   *
   * Sure, the Apollo Client or a simple `cache-control` header could prevent
   * the request even when there would be a function call for fetching this
   * data. But I wanted to show how can this be achieved using purely the Ember
   * routing, with its "telescopic" design.
   *
   * Besides, I wanted the filter section to remain visible and untouched while
   * the products table is refreshed when the child route index is refreshed.
   */
  model() {
    return {
      properties: this.datastore.getAllProperties(),
    };
  }
}
