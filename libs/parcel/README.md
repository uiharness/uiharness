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
