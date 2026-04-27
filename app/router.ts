import EmberRouter from '@embroider/router';
import config from 'condition-ui-editor/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('products', function () {
    // Specifying `{ path: '/' }` effectively eliminates the generation of the
    // route `products.index`, which would be automatically created otherwise.
    // The goal here is to use the `dashboard` route for grouping, analogous to
    // the group feature of SvelteKit.
    // https://svelte.dev/docs/kit/advanced-routing#Advanced-layouts-(group)
    this.route('dashboard', { path: '/' }, function () {});
  });
});
