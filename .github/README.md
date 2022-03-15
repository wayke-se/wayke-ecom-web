## Development
```bash
npm install
npm start
```

## Deploy
Pushing to main or test will build, publish to cdn and publish to npm.

### main
Before merging to `main` update the version in package.json. If same version allready exist on npm then the operation is aborted. npm version will be tagged as `latest`.

| Files | Url |
| ------|:-------------:|
| js    | https://cdn.wayke.se/public-assets/wayke-ecom-web/1.0.0/index.js |
| css   | https://cdn.wayke.se/public-assets/wayke-ecom-web/1.0.0/index.css |

### test
Before merging to `test` update the version in package.json and add a postfix like `1.1.1-alpha-1`. If same version allready exist on npm then the operation is aborted. Npm version will be tagged as `next`.

| Files | Url |
| ------|:-------------:|
| js    | https://test-cdn.wayketech.se/public-assets/wayke-ecom-web/1.0.0-alpha-1/index.js |
| css   | https://test-cdn.wayketech.se/public-assets/wayke-ecom-web/1.0.0-alpha-1/index.css |

## Component Library

This repository uses a custom built component library to present the front-end components. To start the component library, run the following command.

```bash
npm run cl
```

The component library will start on http://localhost:8000/.

### Add components

All components should be documented in the component library. To add a new component to the library add a `html` file corresponding to the component name in `component-library/component`.

The file name will be used as title for the component. To add a description - put a html comment on top of the file containing the description. See the example below.

_example-component.html_
```html
<!-- This is a description describing the component. -->

<div class="foo">Lorem ipsum</div>
```

## CSS

Workin with CSS in this project can be a bit tricky if not cautious. We have the responsibility to **never** interfere with the hosting website's _CSS_. We do so by using namespaced selectors. The following base rules apply when writing _CSS_ selectors.

* All classnames are prefixed with `$namespace` (`helpers/variable/_namespace.scss`). To use the prefix in a component, simply place it before the component's name (see example below).

```scss
.#{$namespace}component-name {
  /* Styling goes here... */
}
```

* We do not target root elements outside of our own root element. This element's selector is set to `$root-element` in `helpers/variable/_namespace.scss`. This namespace is primarily used for reset styling.
* All custom properties (CSS variables) are prefixed with `$namespace` (`helpers/variable/_namespace.scss`).

### BEM

This project uses _BEM_ as methodology. All selectors should follow this standard. Try not to nest selectors deeper than two levels. Example shown below.

```scss
.#{$namespace}component-name {
  &--modifier {
    /* Modify the component */
  }

  &__children {
    /* Styling goes here... */
  }

  &__grand-children {
    /* Styling goes here... */
  }
}
```
