# Unchained UI

## Keys

[![NPM Version](https://img.shields.io/npm/v/uc-keys.svg?style=flat-square)](https://www.npmjs.com/package/uc-keys)
[![NPM Downloads](https://img.shields.io/npm/dt/uc-keys.svg?style=flat-square)](https://www.npmjs.com/package/uc-keys)

Hotkeys detection & defenition

ES module version of [is-hotkey](https://github.com/ianstormtaylor/is-hotkey)

### Usage

```js
import isHotkey from 'uc-keys';

function onKeyDown(e) {
  if (isHotkey('mod+s', e)) {
    ...
  }
}
```

For better perfomance you can curry the hotkey:

```js
import isHotkey from 'uc-keys'
const isSaveHotkey = isHotkey('mod+s')

function onKeyDown(e) {
  if (isSaveHotkey(e)) {
    ...
  }
}
```

License MIT

© Ian Storm Taylor

