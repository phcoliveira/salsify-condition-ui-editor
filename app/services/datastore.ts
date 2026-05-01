import Service from '@ember/service';
import type { Params } from 'condition-ui-editor/routes/products/dashboard';
import type { Operator, Property } from 'condition-ui-editor/types/datastore';

export const operatorsByType: Record<Property['type'], Operator['id'][]> = {
  enumerated: ['any', 'equals', 'in', 'none'],
  number: ['any', 'equals', 'greater_than', 'in', 'less_than', 'none'],
  string: ['any', 'contains', 'equals', 'in', 'none'],
};

/**
 * For the sake of simplicity, this service wraps the mock data provided by
 * `window.datastore`.
 * @see {@link ../instance-initializers/datastore.ts} for more details.
 *
 * Normally, an application has a `service:api` wrapping the native `fetch` or
 * an axios or ky instance. Such application could also use Ember Data or
 * Apollo Client, resulting in a `service:store` or `service:apollo`,
 * respectively.
 *
 * Doing this is preferable to directly using `window.datastore` in the app code
 * for various reasons. One of those is that the default testing setup for Ember
 * apps use dependency injection to inject modified versions of services.
 */
export default class DatastoreService extends Service {
  private allOperators = window.datastore.getOperators();

  private allProducts = window.datastore.getProducts();

  private allProperties = window.datastore.getProperties();

  getAllProperties() {
    return this.allProperties;
  }

  getProducts(params: Params) {
    const {
      propertyId,
      operatorId,
      stringValue,
      numberValue,
      enumeratedValue,
    } = params;

    if (propertyId === undefined || operatorId === undefined) {
      return this.allProducts;
    }

    return this.allProducts.filter((product) => {
      const propertyValue = product.property_values.find(
        (propertyValue) => propertyValue.property_id === propertyId,
      );

      switch (operatorId) {
        case 'any':
          return propertyValue !== undefined;
        case 'none':
          return propertyValue === undefined;
        case 'equals':
          if (propertyValue === undefined) return false;

          if (enumeratedValue !== undefined)
            return enumeratedValue.includes(String(propertyValue.value));

          if (numberValue !== undefined)
            return propertyValue.value === numberValue;

          return (
            stringValue !== undefined && propertyValue.value === stringValue
          );
        case 'contains':
          return (
            propertyValue !== undefined &&
            stringValue !== undefined &&
            String(propertyValue.value)
              .toLowerCase()
              .includes(stringValue.toLowerCase())
          );
        case 'greater_than':
          return (
            propertyValue !== undefined &&
            numberValue !== undefined &&
            Number(propertyValue.value) > numberValue
          );
        case 'less_than':
          return (
            propertyValue !== undefined &&
            numberValue !== undefined &&
            Number(propertyValue.value) < numberValue
          );
        case 'in':
          if (propertyValue === undefined) return false;

          if (enumeratedValue !== undefined)
            return enumeratedValue.includes(String(propertyValue.value));

          if (numberValue !== undefined)
            return propertyValue.value === numberValue;

          return (
            stringValue !== undefined && propertyValue.value === stringValue
          );
        default:
          return false;
      }
    });
  }

  getOperators(type: Property['type']) {
    return this.allOperators.filter((operator) =>
      operatorsByType[type].includes(operator.id),
    );
  }
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:datastore')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('datastore') declare altName: DatastoreService;`.
declare module '@ember/service' {
  interface Registry {
    datastore: DatastoreService;
  }
}
