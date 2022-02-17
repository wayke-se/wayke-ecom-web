# Wayke Ecom Web

Repository for Wayke Ecom Web.

## Getting started

__Install dependencies__

```bash
npm install
```

__Start the project__

```bash
npm start
```

## CSS specificity

⚠️ __We can guarantee to not overwrite any of the host site _CSS_. But it is possible for the host site to overwrite the styling in _Wayke Ecom_. Read how to prevent such overwrites below.__

All _CSS_ class names are prefixed using the namespace `.waykeecom-*`. This will prevent this widget to overwrite any _CSS_ applied to the website on which it is implemented on. However, we can not guarantee other _CSS_ files won't overwrite the _CSS_ in _Wayke Ecom_. This is due to it is impossible to protect against element selectors.

Reset styles and other necessary _CSS_ targeting elements are selected using a nested selector based of the root element (`#wayke-ecom`) placed inside a `:where()` to prevent higher specificity than class name selectors.

> Avoid using element selectors (div, a, span etc.) in you website's _CSS_. It is a good practice to only using classes as selectors. If you experience strange styling in the _Wayke Ecom_ widget, this is probably the case.

## Custom CSS

If you want to custommize any _CSS_ we recommend you to include a separate _CSS_ with your styling using our selectors namespaced for higher specificity. I.e., `.you-company-name .waykeecom-[COMPONENT_NAME] { };`.

The easiest way to add a namespace is to wrap the mounting element (`#wayke-ecom`) with a div having this namespace set following the example below.

```html
<div class="your-company-name">
  <div id="wayke-ecom"></div>
</div>
```

> **Important:** We can not guarantee our class names will stay the same or behave the same as they do at a specific time. Please understand that you may have to change the _CSS_ continuously if you decide to add custom styling.

## Headings

To prevent multiple `h1` on your website, _Wayke Ecom_ does not include a `h1` as root heading level. Instead the headings starts from h2.

## Development

Deploy to npm:
Update package.json version
```bash
npm run build
npm publish --access public
```
Bundles can be found at /dist

Create cdn-bundle
Update package.json version
```bash
npm run build
```
Bundles can be found at /dist-cdn