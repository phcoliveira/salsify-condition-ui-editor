import Component from '@glimmer/component';
import type { Product, Property } from 'condition-ui-editor/types/datastore';
import { SimpleTable } from 'frontile';

export interface ProductsTableSignature {
  Args: {
    products: Product[];
    properties: Property[];
  };
  Blocks: {
    default: [];
  };
  Element: null;
}

function getOrderedProperties(properties: Property[], product: Product) {
  return properties.map((property) => {
    const propertyValue = product.property_values.find(
      (propertyValue) => propertyValue.property_id === property.id,
    );

    return { id: property.id, value: propertyValue?.value };
  });
}

export default class ProductsTable extends Component<ProductsTableSignature> {
  /**
   * This does not seem quite right. Having a dynamic set of columns, like this,
   * might be problematic. But I suppose that such a table can be scrolled
   * horizontally, or some controls might hide some columns.
   */
  get headers() {
    return this.args.properties.map((property) => property.name);
  }

  <template>
    <SimpleTable as |t|>
      <t.Header>
        {{#each this.headers as |header|}}
          <t.Column data-test-products-products-table="column">
            {{header}}
          </t.Column>
        {{/each}}
      </t.Header>

      <t.Body>
        {{#each @products as |product|}}
          <t.Row
            data-test-products-products-table="row"
            data-product-id={{product.id}}
          >
            {{#each (getOrderedProperties @properties product) as |property|}}
              <t.Cell
                data-test-products-products-table="cell"
                data-property-id={{property.id}}
              >
                {{property.value}}
              </t.Cell>
            {{/each}}
          </t.Row>
        {{/each}}
      </t.Body>
    </SimpleTable>
  </template>
}
