[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![uiharness](https://user-images.githubusercontent.com/185555/51497576-6c89b500-1e28-11e9-9525-ff1769c2d8af.png)

Precisely isolate, develop and test your UI components in [typescript](https://www.typescriptlang.org/) / [react](https://reactjs.org/), targeting [electron](https://electronjs.org/) or the [web](https://developer.mozilla.org).  
[uiharness.com](https://uiharness.com)

----

![pre-release](https://img.shields.io/badge/Status-pre--release-orange.svg)  
API's will change radically. `v4` release coming soon.

<p>&nbsp;</p>
<p>&nbsp;</p>



## Getting Started

### Quick Start
Be up and running with a scaffold for [electron](https://electronjs.org/) or the [web](https://developer.mozilla.org) in less than 30 seconds:

```bash
yarn create uiharness
```


### Installation
Or manually add the UIHarness to your module.  
Target the [web](https://developer.mozilla.org) (browser):

```bash
yarn add -D @uiharness/web
```

Target the desktop with [electron](https://electronjs.org):

```bash
yarn add -D @uiharness/electron     # Server tools (js bundler, electron builder)
yarn add    @uiharness/electron.ui  # Client tools (bundled with app as dependency)
```


<p>&nbsp;</p>
<p>&nbsp;</p>


## 🔗 Modules
- [@uiharness/web](/code/libs/web/README.md)
- [@uiharness/electron](/code/libs/electron/README.md)
- [@uiharness/electron.ui](code/libs/electron.ui/README.md)
- [@uiharness/core](/code/libs/core/README.md)
