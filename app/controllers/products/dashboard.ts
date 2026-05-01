import type { ControllerQueryParam } from '@ember/controller';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service, type Registry } from '@ember/service';
import { isPresent } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import type { FiltersFormSchema as Filters } from 'condition-ui-editor/components/products/dashboard-filters.gts';
import type {
  Model,
  Params,
} from 'condition-ui-editor/routes/products/dashboard';
import { cancelDebounce, debounceTask } from 'ember-lifeline';

export default class ProductsDashboardController extends Controller<Model> {
  @service
  declare readonly router: Registry['router'];

  queryParams: readonly ControllerQueryParam[] = [
    { operatorId: { type: 'string' } },
    { propertyId: { type: 'number' } },
    { stringValue: { type: 'string' } },
    { numberValue: { type: 'number' } },
    { enumeratedValue: { type: 'array' } },
  ];

  @tracked operatorId: Params['operatorId'] = undefined;
  @tracked propertyId: Params['propertyId'] = undefined;
  @tracked stringValue: Params['stringValue'] = undefined;
  @tracked numberValue: Params['numberValue'] = undefined;
  @tracked enumeratedValue: Params['enumeratedValue'] = undefined;

  get filters(): Filters {
    return {
      operatorId: this.operatorId,
      propertyId: this.propertyId?.toString(),
      stringValue: this.stringValue,
      numberValue: this.numberValue?.toString(),
      enumeratedValue: this.enumeratedValue,
    };
  }

  @action
  onFiltersChange(filters: Filters, slowInput = false) {
    const {
      operatorId,
      propertyId,
      stringValue,
      numberValue,
      enumeratedValue,
    } = filters;

    this.operatorId = operatorId;
    this.propertyId = isPresent(propertyId)
      ? parseInt(propertyId, 10)
      : undefined;
    this.stringValue = stringValue;
    this.numberValue = isPresent(numberValue)
      ? parseInt(numberValue, 10)
      : undefined;
    this.enumeratedValue = enumeratedValue;

    if (slowInput) {
      debounceTask(this, 'refreshChildRoute', 400);
    } else {
      cancelDebounce(this, 'refreshChildRoute');
      // This is necessary to ensure that the child route runs its model hook
      // with updated params.
      debounceTask(this, 'refreshChildRoute', 1);
    }
  }

  private refreshChildRoute() {
    this.router.refresh('products.dashboard.index');
  }
}
