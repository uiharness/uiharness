[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![title](https://user-images.githubusercontent.com/185555/51221318-de33b000-199d-11e9-8ad8-b244c1aab3e4.jpg)

Shared logic of the [UIHarness](https://uiharness.com).

<p>&nbsp;</p>
<p>&nbsp;</p>


## Configuration
The UIHarness looks for a `uiharness.yml` file in the root of the module.

```yaml
port: 8080

entry:
  - title: My Title
    path: src/uiharness.tsx

# Build args.
sourcemaps: true
treeshake: false
```

#### 🌳  port `number`
The port to run the development server on.

<p>&nbsp;</p>

#### 🌳 entry `string | string[] | object | objects[]`
Entry points to the files to bundle.

- When `string` (or `string[]`) this represents the path to the `.tsx` files. Default: `/src/uiharness.tsx`.

- When `object` (or `object[]`) this represents the path to the `.tsx` file and the page title.

  ```
  {
    title?: string,
    path?: string
  }
  ```

<p>&nbsp;</p>


#### 🌳 sourcemaps `boolean`
Use or disable sourcemaps. Default `true`.
See [parcel/source-maps](https://parceljs.org/cli.html#disable-source-maps).

<p>&nbsp;</p>

#### 🌳 treeshake `boolean`
Use or disable (experimental) treeshaking. Default `false`.
See [parcel/tree-shaking](https://parceljs.org/cli.html#enable-experimental-scope-hoisting/tree-shaking-support).

<p>&nbsp;</p>

