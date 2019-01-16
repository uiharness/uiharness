# UIHarness (React)

☣️ NOTE: OBSOLETE (the webpack version is currently not maintained, use [@uiharness/web](../parcel))

Provides an [extensible](https://github.com/harrysolovay/rescripts), modern, [ceate-react-app](https://facebook.github.io/create-react-app) configuration for building a component library with a UIHarness.

See:

- https://facebook.github.io/create-react-app (base configuration)
- https://github.com/harrysolovay/rescripts (extensibility hooks, see `.rescriptsrc.js`)

## Setup

```bash
yarn add -D @uiharness/webpack
```

Ensure you have the following command in your `postinstall` script in `package.json`:

```json
{
  "scripts": {
    "postinstall": "uiharness init"
  }
}
```

This will ensure all default files are copied into the module, and that the standard scripts for operating the UIHarness are available.

```json
{
  "scripts": {
    "start": "uiharness start",
    "bundle": "uiharness bundle",
    "serve": "serve -s build"
  }
}
```
