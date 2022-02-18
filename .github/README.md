## Development

Deploy to npm:
Update package.json version
```bash
npm install
npm start
```

## Deploy
Pushing to main or test will build, publish to cdn and publish to npm.

### main
Before merging to main update the version in package.json. If same version allready exist on npm then the operation is aborted. npm version will be tagged as `latest`.

| Files | Url |
| ------|:-------------:|
| js    | https://cdn.wayke.se/public-assets/wayke-ecom-web/1.0.0/index.js |
| css   | https://cdn.wayke.se/public-assets/wayke-ecom-web/1.0.0/index.css |

### test
Before merging to test update the version in package.json and add a postfix like `1.1.1-alpha-1`. If same version allready exist on npm then the operation is aborted. Npm version will be tagged as `next`.

| Files | Url |
| ------|:-------------:|
| js    | https://test-cdn.wayketech.se/public-assets/wayke-ecom-web/1.0.0-alpha-1/index.js |
| css   | https://test-cdn.wayketech.se/public-assets/wayke-ecom-web/1.0.0-alpha-1/index.css |


