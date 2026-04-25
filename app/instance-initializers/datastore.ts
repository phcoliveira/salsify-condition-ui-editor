import '../../datastore';

export function initialize() {}

/**
 * This may be an overkill for the current needs of the application, but I did
 * not want to modify the provided file `datastore.js`.
 *
 * The instructions say that different clients have different products and
 * properties. So, if something like this should be used in production, an
 * instance initializer is recommended over an application initializer. This is
 * specially important if using Fastboot.
 *
 * What is important to notice is that this initializer is run before the
 * application instance is created, thus guaranteeing that the window object
 * is properly populated before any component or service tries to access it.
 */
export default {
  name: 'datastore',
  initialize,
};
