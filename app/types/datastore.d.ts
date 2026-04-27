type OperatorId =
  | 'any'
  | 'contains'
  | 'equals'
  | 'greater_than'
  | 'in'
  | 'less_than'
  | 'none';

export type Operator = Readonly<{
  id: OperatorId;
  text: string;
}>;

export type Property = Readonly<
  { id: number; name: string } & (
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
