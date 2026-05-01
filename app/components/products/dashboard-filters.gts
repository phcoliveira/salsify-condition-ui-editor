import { array } from '@ember/helper';
import { action } from '@ember/object';
import { service, type Registry } from '@ember/service';
import Component from '@glimmer/component';
import type { Property } from 'condition-ui-editor/types/datastore';
import { eq } from 'ember-truth-helpers';
import { Button, Form, type FormResultData } from 'frontile';
import * as v from 'valibot';

const filtersFormSchema = v.object({
  propertyId: v.optional(v.string()),
  operatorId: v.optional(v.string()),
  stringValue: v.optional(v.string()),
  numberValue: v.optional(v.string()),
  enumeratedValue: v.optional(v.array(v.string())),
});

export type FiltersFormSchema = v.InferOutput<typeof filtersFormSchema>;

export interface Signature {
  Args: {
    filters: FiltersFormSchema;
    onChange?: (filters: FiltersFormSchema, slowInput: boolean) => unknown;
    properties: Property[];
  };
  Blocks: {
    default: []
  };
  Element: HTMLDivElement;
}

export default class ProductsDashboardFilters extends Component<Signature> {
  @service
  declare datastore: Registry['datastore'];

  private get selectedProperty() {
    const { properties } = this.args;
    const { propertyId } = this.args.filters;

    if (propertyId === undefined) return undefined;

    const property = properties.find(
      (property) => property.id.toString() === propertyId
    );

    // The only case I could think of is when a user manually edits the URL,
    // informing an inexistent property id. So this is not just a measure for
    // ensuring type safety.
    //
    // Because of this, I opted to return the first property for simplicity. And
    // I would also capture a warning with Sentry.
    //
    // If deemed more appropriate, we could also throw an error or display a
    // message.
    if (!property) return properties[0] ?? undefined;

    return property;
  }

  get properties() {
    return this.args.properties.map(
      (property) => ({ id: property.id.toString(), name: property.name })
    )
  }

  get operators() {
    if (this.selectedProperty === undefined) return [];

    return this.datastore.getOperators(this.selectedProperty.type).map(
      (operator) => ({ id: operator.id, name: operator.text })
    );
  }

  get enumeratedItems() {
    if (this.selectedProperty?.type !== 'enumerated') return [];

    return this.selectedProperty.values;
  }

  /**
   * When a property changes, and specially to one of a different type, it is
   * weird to maintain an eventual operator selected. For that reason, when
   * setting a new property, the other filters down the line are reset.
   */
  @action
  onPropertyIdChange(value: string | null) {
    this.notifyChanges(
      {
        propertyId: value ?? undefined,
        operatorId: undefined,
        stringValue: undefined,
        numberValue: undefined,
        enumeratedValue: undefined,
      },
      false
    )
  }

  /**
   * Changing the operator, on the other hand, does not cause the same
   * strangeness as changing the property. Because of this, it is reasonable to
   * keep the current value downstream, if available.
   */
  @action
  onOperatorIdChange(value: string | null) {
    this.notifyChanges(
      {
        ...this.args.filters,
        operatorId: value ?? undefined,
      },
      false
    )
  }

  @action
  onStringValueChange(value: string | null) {
    this.notifyChanges(
      {
        ...this.args.filters,
        stringValue: value ?? undefined,
      },
      true
    )
  }

  @action
  onNumberValueChange(value: string | null) {
    this.notifyChanges(
      {
        ...this.args.filters,
        numberValue: value ?? undefined,
      },
      true
    )
  }

  @action
  onEnumeratedValueChange(value: string[] | null) {
    this.notifyChanges(
      {
        ...this.args.filters,
        enumeratedValue: value ?? undefined,
      },
      true
    )
  }

  @action
  clearFilters() {
    this.notifyChanges(
      {
        propertyId: undefined,
        operatorId: undefined,
        stringValue: undefined,
        numberValue: undefined,
        enumeratedValue: undefined,
      },
      false
    )
  }

  @action
  onFormSubmit(result: FormResultData<FiltersFormSchema>) {
    this.notifyChanges(
      {
        ...this.args.filters,
        ...result.data,
      },
      false
    );
  }

  private notifyChanges(filters: FiltersFormSchema, slowInput = false) {
    try {
      const parsedFilters = v.parse(filtersFormSchema, filters);

      this.args.onChange?.(parsedFilters, slowInput);
    } catch (exception: unknown) {
      // NOTE: Although unlikely to happen, it would be useful to proactively
      // use Sentry here. Should an exception ever appear here, it would help us
      // to understand how to handle it.
      //
      // captureException(exception);

      void exception;
    }
  }

  <template>
    <Form @onSubmit={{this.onFormSubmit}} as |form|>
      <div class="grid grid-cols-4 gap-4 items-end">
        {{!--
          NOTE: This #each block serves the purpose of using a 'key' in React
          and Svelte. It forces the block to be rerendered whenever the array
          changes, instead of relying on Glimmer's fine-grained reactivity.

          This is likely a problem with Frontile itself. Setting a property to
          undefined does trigger the desired behaviour of updating the URL.

          However, the component 'field.SingleSelect' does not update properly,
          preserving the last option selected, even when it is unavailable due to
          a property type change.

          By forcing this block to be rerendered, that problem is solved.
        --}}
        {{#each (array @filters.propertyId)}}
          <form.Field @name="propertyId" as |field|>
            <field.SingleSelect
              @allowEmpty={{true}}
              @label="Select a property"
              @items={{this.properties}}
              @onSelectionChange={{this.onPropertyIdChange}}
              @selectedKey={{@filters.propertyId}}
            />
          </form.Field>
        {{/each}}

        {{#each (array @filters.operatorId)}}
          {{#if @filters.propertyId}}
            <form.Field @name="operatorId" as |field|>
              <field.SingleSelect
                @allowEmpty={{false}}
                @label="Select an operator"
                @items={{this.operators}}
                @onSelectionChange={{this.onOperatorIdChange}}
                @selectedKey={{@filters.operatorId}}
              />
            </form.Field>
          {{/if}}
        {{/each}}

        {{!--
          NOTE: Unlike the 'operatorId', it is OK to keep the current value. So
          there is no need to rerender this block.
        --}}
        {{#if @filters.operatorId}}
          {{#if (eq this.selectedProperty.type "enumerated")}}
            <form.Field @name="enumeratedValue" as |field|>
              <field.MultiSelect
                @allowEmpty={{true}}
                @label="Select one or more values"
                @items={{this.enumeratedItems}}
                @onSelectionChange={{this.onEnumeratedValueChange}}
                @selectedKeys={{@filters.enumeratedValue}}
              />
            </form.Field>
          {{else if (eq this.selectedProperty.type "number")}}
            <form.Field @name="numberValue" as |field|>
              <field.Input
                @label="Insert a number"
                @onInput={{this.onNumberValueChange}}
                @type="number"
                @value={{@filters.numberValue}}
              />
            </form.Field>
          {{else}}
            <form.Field @name="stringValue" as |field|>
              <field.Input
                @label="Insert a value"
                @onInput={{this.onStringValueChange}}
                @value={{@filters.stringValue}}
              />
            </form.Field>
          {{/if}}
        {{/if}}

        <div class=" col-start-4 flex flex-row flex-nowrap justify-end">
          <Button
            @class="block"
            @onPress={{this.clearFilters}}
            @size="lg"
            @type="reset"
          >
            Clear
          </Button>
        </div>
      </div>
    </Form>
  </template>
}
