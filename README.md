[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![uiharness](https://user-images.githubusercontent.com/185555/51708395-b4a71280-2088-11e9-95ac-ed659c36476c.png)](https://uiharness.com)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fuiharness%2Fuiharness.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fuiharness%2Fuiharness?ref=badge_shield)



Isolate, develop and test your UI components in [typescript](https://www.typescriptlang.org/) / [react](https://reactjs.org/), targeting [electron](https://electronjs.org/) and the [web](https://developer.mozilla.org).  
[uiharness.com](https://uiharness.com)

----

![pre-release](https://img.shields.io/badge/Status-pre--release-orange.svg)  
API's will change (probably radically 🐷 ).  
`v4` release coming soon.

<p>&nbsp;</p>
<p>&nbsp;</p>



## Getting Started

### Quick Start
Be up and running with a scaffold for [electron](https://electronjs.org/) or the [web](https://developer.mozilla.org) in less than 30 seconds (recommended):

```bash
yarn create uiharness
```


### Installation
Or manually add the UIHarness to your module.  

```bash
yarn add -D @uiharness/core
```

ensure you run `uiharness init` as a post-install step, allowing the UIHarness to flesh out the configuration. 

```json
{
  "scripts": {
    "postinstall": "uiharness init",
  },
  "devDependencies": {
    "@uiharness/core": "x.x.x"
  }
}
```




<p>&nbsp;</p>
<p>&nbsp;</p>


## 🔗 Modules
- [npm](https://www.npmjs.com/org/uiharness)
- [@uiharness/core](/code/libs/core/README.md)
- [@uiharness/electron](/code/libs/electron/README.md)

<p>&nbsp;</p>


## Sponsor
Proudly sponsored by [Hypersheet](https://hypersheet.io):

[![Hypersheet](https://user-images.githubusercontent.com/185555/51567641-944a4d00-1efc-11e9-8fab-8ad81862226c.png)](https://hypersheet.io)

## See also
- [github/create-tmpl](https://github.com/philcockfield/create-tmpl)



## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fuiharness%2Fuiharness.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fuiharness%2Fuiharness?ref=badge_large)