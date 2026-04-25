import { Datastore } from "./datastore";

declare global {
  interface Window {
    /**
     * This type partially represents the datastore object that is available on the
     * global window object. It provides methods to retrieve products, properties,
     * and operators from the datastore.
     *
     * It intentionally does not include the properties of the object as its
     * methods are meant to return such values.
     */
    datastore: Datastore;
  }
}
