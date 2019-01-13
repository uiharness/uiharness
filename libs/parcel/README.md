[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# UIHarness

The UIHarness using the lightening fast [Parcel](https://parceljs.org) bundler with [React](https://reactjs.org/) and [Typescript](https://www.typescriptlang.org/).

## Setup

```bash
yarn add -D @uiharness/parcel
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

Include a `.uiharness.yml` file in the root of your module. This is automatically generated via `uiharness init` in your `postinstall`. All values are optional.

```yaml
port: 8080

entry:
  - title: My Title
    path: src/uiharness.tsx

# Build args.
target: 'browser' # 'browser' | 'node' | 'electron'
sourcemaps: true
treeshake: false
```

### port `number`

The port to run the development server on.

### entry `string | string[] | object | objects[]`

Entry points to the files to bundle.

- When `string` (or `string[]`) this represents the path to the `.tsx` files. Default: `/src/uiharness.tsx`.

- When `object` (or `object[]`) this represents the path to the `.tsx` file and the page title.

  ```
  {
    title?: string,
    path?: string
  }
  ```

### target `string`

The target environment to build for. Default `browser`.
See [parcel/target](https://parceljs.org/cli.html#target).

### sourcemaps `boolean`

Use or disable sourcemaps. Default `true`.
See [parcel/source-maps](https://parceljs.org/cli.html#disable-source-maps).

### treeshake `boolean`

Use or disable (experimental) treeshaking. Default `false`.
See [parcel/tree-shaking](https://parceljs.org/cli.html#enable-experimental-scope-hoisting/tree-shaking-support).
