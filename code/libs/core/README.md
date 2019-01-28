[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![title](https://user-images.githubusercontent.com/185555/51809542-ad8d3800-2306-11e9-8732-a0a971ef4ab8.png)

Isolate, develop and test your UI components in [typescript](https://www.typescriptlang.org/) / [react](https://reactjs.org/), targeting [electron](https://electronjs.org/) and the [web](https://developer.mozilla.org).  
[uiharness.com](https://uiharness.com)

---

This module contains the [UIHarness](https://uiharness.com) development server and bundler:

- CLI (command line interface)
- JS bunder, HMR development server.
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

