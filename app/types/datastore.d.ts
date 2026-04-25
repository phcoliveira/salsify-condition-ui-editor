export type Operator = Readonly<{
  id:
    | 'equals'
    | 'greater_than'
    | 'less_than'
    | 'any'
    | 'none'
    | 'in'
    | 'contains';
  text: string;
}>;

export type Property = Readonly<
  { id: number; name: string }
  & (
    | { type: 'string' | 'number' }
    | { type: 'enumerated'; values: string[] }
  )
>;

export type PropertyValue = Readonly<{
  property_id: number;
  value: string | number;
}>;

export type Product = Readonly<{
  id: number;
  property_values: PropertyValue[];
}>;

export type Datastore = Readonly<{
  getProducts: () => Product[];
  getProperties: () => Property[];
  getOperators: () => Operator[];
}>;
