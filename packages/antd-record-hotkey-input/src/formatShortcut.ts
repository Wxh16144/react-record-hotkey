import UAParser from 'ua-parser-js';

const getPaser = () => {
  if (typeof window === 'undefined') return new UAParser('Node');

  const ua = navigator.userAgent;
  return new UAParser(ua);
};

const isMacOS = getPaser().getOS().name === 'Mac OS';

const COMMON_SEMANTIC = {
  backquote: '`',
  minus: '-',
  plus: '+',
  equal: '=',
  bracketleft: '[',
  bracketright: ']',
  semicolon: ';',
  quote: "'",
  comma: ',',
  period: '.',
  slash: '/',
  backslash: '\\',
};

const MACOS_MODIFIER = {
  // alt: '⌥',
  // ctrl: '^',
  // shift: '⇧',
  // meta: '⌘',
  alt: 'Option',
  ctrl: 'Control',
  shift: 'Shift',
  meta: 'Command',
};

const WINDOWS_MODIFIER = {
  alt: 'Alt',
  ctrl: 'Ctrl',
  shift: 'Shift',
  meta: 'Win',
};

const sematicKey = {
  ...COMMON_SEMANTIC,
  ...(isMacOS ? MACOS_MODIFIER : WINDOWS_MODIFIER),
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatShortcut = (shortcut: string) => {
  return shortcut
    .split('+')
    .map((key) => {
      const trimKey = key.trim();
      if (trimKey in sematicKey) {
        return sematicKey[trimKey as keyof typeof sematicKey];
      }
      return capitalize(key.trim());
    })
    .join(' + ');
};

export default formatShortcut;
