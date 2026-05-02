# About the app

The application is fairly robust. I didn't want to do just the bare minimum, so I included other functionalities to demonstrate my familiarity with Ember.Js.

## Routing

I used Ember's telescopic routing for arranging the routes in a domain-driven, RESTful way. I wrote many comments explaining my decisions.

One of the features I wanted to show is the ability to preserve the search filters in the URL, so it can be shared easily with others.

Also, I opted to replace the current history state with each new set of filters in order to maintain one single click on the browser's back button to exit the products dashboard.

Files of interest:

- [app/router.ts](app/router.ts)
- [app/routes/products/dashboard.ts](app/routes/products/dashboard.ts)
- [app/routes/products/dashboard/index.ts](app/routes/products/dashboard/index.ts)

## Components

The most complex component is the [app/components/products/dashboard-filters.gts](app/components/products/dashboard-filters.gts). It servers the purpose of providing the controls for a user to set filters and so on.

It does not keep a state of its own, as it acts like a single input control. What I mean by that is that this controller works following Ember's guideline of DDAU: data down, action up.

Because of this, the consumer of such component is responsible to update its model/state once an action is triggered.

The component [app/components/products/products-table.gts](app/components/products/products-table.gts) is straight-forward.

## Services

The service [app/service/datastore.ts](app/services/datastore.ts) is responsible for providing the data needed by the application. It also has a quite bulky method for filtering the products, which is something usually done by the backend.

## Instance initializers

The instance initializer [app/instance-initializers/datastore.ts](app/instance-initializers/datastore.ts) is responsible for importing the provided file [datastore.js](datastore.js) before the application starts, ensuring that property `window.datastore` is populated before the app code can consume it.

## Controllers

The controller [app/controllers/products/dashboard.ts](app/controllers/products/dashboard.ts) has two important responsibilities.

1. It maps the query parameters in a two-way road with the dashboard filters component.

Due to some difficulties in working with Frontile and Valibot (my first time using both), two query params that are numbers need to be parsed to strings before being passed to the component: data down.

Likewise, the controller also parsed the respective string values to numbers, for being assigned to the query params: action up.

2. It refreshes the child route `products.dashboard.index`, which is responsible for loading the products.

Please notice that I used a parameter named `slowInput` to indicate wether or not such refreshing should be debounced.

I didn't want to refresh the model at each input immediately, so the property values that need to be typed are considered as slow inputs.

## Polaris, Libraries and TypeScript

I wanted to make this challenge using Ember Polaris for the sake of showing that I familiar with it. Rest assured, I can still work with classical components from the pre-Octane era.

Choosing the libraries took me a lot of time.

Every project that I ever worked with still uses Ember-Power-Select, which brings in Ember-Basic-Dropdown and Ember-Concurrency. Although I am very familiar with them, I prefer not to use them, if I have the option. Happy to discuss that in a chat.

I was my first time using Frontile and Valibot. I am glad I found them, but they took me the best part of my working time. I had too many problems with Frontile's Form.

For me, TypeScript is just easier to work with. I genuinely spend less time working with TS than working with JS files.

## Development process, Code Assistant

Without getting into personal matters, I still have to say that I had a terrible week. Sorry about that.

All in all, I must have worked about 24 hours on this project, 3 days worth. But, unfortunately, they weren't all spent on a regular 9 to 5 working day basis.

I don't use Claude or any other LLM for architectural choices. The routing, the URL composition and query params, the types and so on... It was all decided by me. Not that I don't like Claude Code. Quite the contrary.

Claude wrote most of the testing code, however. I give the app file and test file as context to Claude and ask it, first, to produce a list of the tests' titles of important tests. Once we agree on the tests that are important to make, I ask Claude to write them and then I correct any mistakes.

The exception was acceptance test, which I wrote entirely by hand.

## Improvements to make

- Use an object as options for passing `slowInput` upwards. This `{ slowInput: true }` is better than `true`.
- Use Valibot `v.parse()` on every callback before setting the new value.

## About me

Paulo Henrique Costa de Oliveira
[LinkedIn](https://www.linkedin.com/in/oliveira-phc)
