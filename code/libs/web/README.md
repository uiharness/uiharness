[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![title](https://user-images.githubusercontent.com/185555/51221316-dd9b1980-199d-11e9-8b78-26bbafd344f1.jpg)


The [UIHarness](https://uiharness.com) using the lightening fast [Parcel](https://parceljs.org) bundler with [React](https://reactjs.org/) and [Typescript](https://www.typescriptlang.org/).

## Quick Start
Run the bootstrapper for a fresh module with the UIHarness configured:

```bash
yarn create uiharness
```



## Manual Setup
```bash
yarn add -D @uiharness/builder
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
    "stats": "uiharness stats",
    "serve": "serve -s build"
  }
}
```

## Commands

### `start`

Starts the UIHarness in development mode with live-updates and HMR (hot-module-replacement) in action.

### `bundle`

Packages a bundle into the `/dist` folder.

### `stats`

Reads out details about the `/dist` bundle (eg. file sizes).

### `serve`

Starts an HTTP server to view the bundles `/dist` folder.
Run `yarn bundle` first.

## Configuration

Include a `.uiharness.yml` file in the root of your module. 
This is automatically generated via `uiharness init` in your `postinstall`. 
All values are optional.

See [configuration documentation](../core/README.md#configuration)
