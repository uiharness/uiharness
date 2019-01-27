[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![title](https://user-images.githubusercontent.com/185555/51795890-4e202100-224f-11e9-9e8b-cd114f226530.jpg)

[UIHarness](https://uiharness.com) targeting an [electron](https://electronjs.org/) desktop shell using [react](https://reactjs.org/) and [typescript](https://www.typescriptlang.org/).

This module contains the development tools to use the UIHarness for both electron and the web, including:

- CLI (command line interface)
- JS bunder and development server.
- Electron builder.
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

<p>&nbsp;</p>

