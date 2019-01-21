[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![title](https://user-images.githubusercontent.com/185555/51246809-2a0f4500-19f0-11e9-9bcc-182aa8a8cf1a.jpg)


[UIHarness](https://uiharness.com) targeting the [web/browser](https://developer.mozilla.org) with the lightening fast [parcel](https://parceljs.org) using [react](https://reactjs.org/) and [typescript](https://www.typescriptlang.org/).


<p>&nbsp;</p>
<p>&nbsp;</p>


## Quick Start
Run the bootstrapper for a fresh module with the UIHarness configured:

```bash
yarn create uiharness
```


<p>&nbsp;</p>
<p>&nbsp;</p>


## Manual Setup
```bash
yarn add -D @uiharness/web
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

<p>&nbsp;</p>
<p>&nbsp;</p>

## Commands

### 🌳 `start`
Starts the UIHarness in development mode with live-updates and HMR (hot-module-replacement) in action.

### 🌳 `bundle`
Packages a bundle into the `/dist` folder.

### 🌳 `stats`
Reads out details about the `/dist` bundle (eg. file sizes).

### 🌳 `serve`
Starts an HTTP server to view the bundles `/dist` folder.
Run `yarn bundle` first.

<p>&nbsp;</p>
<p>&nbsp;</p>

## Configuration
Include a `uiharness.yml` file in the root of your module.  
This is automatically generated via `uiharness init` in your `postinstall`. 
All values are optional.

See [configuration documentation](../core/README.md#configuration).

<p>&nbsp;</p>
<p>&nbsp;</p>

## 🔗 Modules
- [@uiharness/web](code/libs/web/README.md)
- [@uiharness/electron](/code/libs/electron/README.md)
- [@uiharness/electron.dev](code/libs/electron.dev/README.md)
- [@uiharness/core](code/libs/core/README.md)
