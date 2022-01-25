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

## CSS

All _CSS_ is prefixed using the namespace `.waykeecom-*`. This will prevent this widget to overwrite any _CSS_ applied to the website on which it is implemented on. However, we can not guarantee other _CSS_ files won't overwrite the _CSS_ in _Wayke Ecom_. This is due to it is impossible to protect against element selectors.

> Avoid using element selectors (div, a, span etc.) in you website's _CSS_. It is a good practice to only using classes as selectors. If you experience strange styling in the _Wayke Ecom_ widget, this is probably the case.

## Headings

To prevent multiple `h1` on your website, _Wayke Ecom_ does not include a `h1` as root heading level. Instead the headings starts from h2.