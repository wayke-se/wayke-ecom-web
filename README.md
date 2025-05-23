# Wayke Ecom Web

Repository for Wayke Ecom Web.

## Getting started

**Using npm**

```bash
npm install @wayke-se/ecom-web
```

```js
import WaykeEcomWeb from '@wayke-se/ecom-web';
import '@wayke-se/ecom-web/dist/index.css';

const context = new WaykeEcomWeb({
  id: '36364808-671a-49da-b69a-5e0fc4cfe83e',
  ecomSdkConfig: {
    api: {
      address: 'https://ecom.wayketech.se',
    },
  },
});

constext.start();
```

**Using cdn**
The associated css is injected into head by default once a `new WaykeEcomWeb(...)` is called. This can be turned off by adding `disablecssinjection` to the script tag.

```html
<button id="ecom-button">Start</button>

<script
  type="module"
  src="https://cdn.wayke.se/public-assets/wayke-ecom-web/x.x.x/index.js"
></script>

<script>
  window.addEventListener('DOMContentLoaded', (_) => {
    var context = new WaykeEcomWeb({
      id: '36364808-671a-49da-b69a-5e0fc4cfe83e',
      ecomSdkConfig: {
        api: {
          address: 'https://ecom.wayketech.se',
        },
      },
    });

    document.getElementById('ecom-button').addEventListener('click', () => context.start());
  });
</script>
```

## Full configuration

```js
new WaykeEcomWeb({
  id: '36364808-671a-49da-b69a-5e0fc4cfe83e',
  rootId: 'random-element-id',
  marketCode: 'SE',
  vehicle: {
    title: 'Lorem ipsum',
    shortDescription: 'Lorem ipsum',
    price: 250000,
    imageUrls: ['https://www...', 'https://www...'],
    modelYear: 2013,
    milage: 4900,
    gearBox: 'Automat',
    fuelType: 'Bensin',
  },
  ecomSdkConfig: {
    api: {
      address: 'https://ecom.wayketech.se',
    },
    bankIdThumbprint: '[Dealer Specific BankId Certificate Thumbprint]', // OPTIONAL
  },
  logo: 'https://placehold.co/180x40', // OPTIONAL
  logoX2: 'https://placehold.co/360x80', // OPTIONAL
  onEvent: (view, event, step, data) => // OPTIONAL
    console.log({
      view,
      event,
      step,
      data,
    }),
});
```

### Instance

Instance contains three public methods, `.start()`, `.close()` and `.destroy()`.

### Required

- `id` Id of the vehicle from Wayke
- `ecomSdkConfig.api.address` Should be one of the following urls below:

| Environment | Url                       |
| ----------- | ------------------------- |
| Test        | https://ecom.wayketech.se |
| Production  | https://ecom.wayke.se     |

### Optional

- `rootId` Choose the element, id, that WakeEcomWeb should append to, by default it will be appended to the body.
- `marketCode` Used to specify which market to operate in (`'SE'` or `'NO'`), defaults to `'SE'` if unspecified.
- `vehicle` Used to override specific vehicle data properties provided from Wayke.
- `ecomSdkConfig.bankIdThumbprint` By default Wayke's BankId certificate is used to verify customer identity. There is an optional configuration property `bankIdThumbprint` which allows for dealers to use their own BankId certificate. If the certificate's thumbprint is set that certificate will be used instead, given that it is correctly setup in the Dealer back-office.
- `logo` Logo to be displayed in the header of the modal.
- `logoX2` Logo to be displayed in the header with higher resolution of the modal.
- `onEvent` Attack function to listen for callback. Callback will be called with 3 parameters

### onEvent argsuments

| Parameter | Value     | Optional |
| --------- | --------- | -------- |
| view      | EcomView  | false    |
| event     | EcomEvent | false    |
| step      | EcomStep  | true     |
| data      | any       | true     |

Above types are located in `src/Utils/ecomEvent.ts`

## CSS specificity

⚠️ **We can guarantee to not overwrite any of the host site _CSS_. But it is possible for the host site to overwrite the styling in _Wayke Ecom_. Read how to prevent such overwrites below.**

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
