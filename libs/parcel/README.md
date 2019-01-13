# UIHarness (React)

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

Options:

- `--treeshake` - Enable experimental tree shaking. Default `false`.
- `--sourcemaps` - Enable or disable sourcemaps. Default: `true`.
- `--target` - Environment to build for (`browser | node | electron`). Default: `browser`.

### `start`

Starts the UIHarness in development mode with live-updates and HMR (hot-module-replacement) in action.

Options:

- `--treeshake`
- `--sourcemaps`
- `--target`

### `bundle`

Packages a bundle into the `/dist` folder.

Options:

- `--treeshake`
- `--sourcemaps`
- `--target`

### `stats`

Reads out details about the `/dist` bundle (eg. file sizes).

### `serve`

Starts an HTTP server to view the bundles `/dist` folder.
Run `yarn bundle` first.
