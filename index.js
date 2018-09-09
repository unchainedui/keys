import { CODES, MODIFIERS, ALIASES } from './keys';

export function toKeyName(name) {
  name = name.toLowerCase()
  name = ALIASES[name] || name
  return name
}

export function toKeyCode(name) {
  name = toKeyName(name)
  const code = CODES[name] || name.toUpperCase().charCodeAt(0)
  return code
}

export function parseHotkey(hotkey, options = {}) {
  const byKey = options.byKey;
  const ret = {};
  // Ensure that all the modifiers are set to false unless the hotkey has them.
  for (const k in MODIFIERS) {
    ret[MODIFIERS[k]] = false
  }

  // Special case to handle the `+` key since we use it as a separator.
  hotkey = hotkey.replace('++', '+add');
  const values = hotkey.split('+');
  const length = values.length;
  values.forEach(value => {
    const optional = value.endsWith('?');

    if (optional) {
      value = value.slice(0, -1);
    }

    const name = toKeyName(value);
    const modifier = MODIFIERS[name];

    if (length === 1 || !modifier) {
      if (byKey) {
        ret.key = name;
      } else {
        ret.which = toKeyCode(value);
      }
    }

    if (modifier) {
      ret[modifier] = optional ? null : true;
    }

    // If there's only one key, and it's not a modifier, ignore the shift key
    // because it will already be taken into accout by the `event.key` value.
    if (length === 1 && !modifier && byKey) {
      ret.shiftKey = null;
    }
  });

  return ret;
}

export function compareHotkey(object, event) {
  for (const key in object) {
    const expected = object[key]
    let actual

    if (!expected) {
      continue
    }

    if (key === 'key') {
      actual = event.key.toLowerCase();
    } else if (key === 'which') {
      actual = expected === 91 && event.which === 93 ? 91 : event.which;
    } else {
      actual = event[key];
    }

    if (!actual && expected === false) {
      continue
    }

    if (actual !== expected) {
      return false
    }
  }

  return true
}

export function isHotkey(hotkey, options, event) {
  if (options && !('byKey' in options)) {
    event = options;
    options = null;
  }

  if (!Array.isArray(hotkey)) {
    hotkey = [ hotkey ];
  }

  const array = hotkey.map(string => parseHotkey(string, options));
  const check = e => array.some(object => compareHotkey(object, e));
  const ret = !event ? check : check(event);
  return ret;
}

export default isHotkey;

export function isCodeHotkey(hotkey, event) {
  return isHotkey(hotkey, event);
}

export function isKeyHotkey(hotkey, event) {
  return isHotkey(hotkey, { byKey: true }, event);
}
