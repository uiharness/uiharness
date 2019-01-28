[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![title](https://user-images.githubusercontent.com/185555/51809542-ad8d3800-2306-11e9-8732-a0a971ef4ab8.png)


This module contains the core [UIHarness](https://uiharness.com) development server:

- CLI (command line interface)
- JS bunder and HMR development server for web and electron.
- Electron distribution builder.
- Web server.

## Installation

Include in the `devDependencies` of your package.json, along with the corresponding client-tools as full `dependencies`:

```json
{
  "scripts": {
    "postinstall": "uiharness init",
  },
  "dependencies": {
    "@uiharness/electron": "x.x.x"
  },
  "devDependencies": {
    "@uiharness/core": "x.x.x"
  }
}
```


<p>&nbsp;</p>
<p>&nbsp;</p>

## 🔗 Refs
- https://electronjs.org
- https://www.electron.build
- https://parceljs.org

<p>&nbsp;</p>

