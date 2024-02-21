import { useEventListener } from 'ahooks';
import React, { useRef, useState } from 'react';
import { mapKey } from './parseHotkeys';

const MODIFIERS = ['ctrl', 'meta', 'alt', 'shift'];

const allowedChars = [
  'backquote',
  'space',
  'enter',
  'minus',
  'plus',
  'equal',
  'backspace',
  'escape',
  'pageup',
  'pagedown',
  'home',
  'end',
  'delete',
  'tab',
  'bracketleft',
  'bracketright',
  'semicolon',
  'quote',
  'comma',
  'period',
  'slash',
  'backslash',
];

const verify = (hotkey: Set<string>) => {
  const hasModifier = MODIFIERS.some((modifier) => hotkey.has(modifier));
  const hasNormalKey = Array.from(hotkey).some((key) => allowedChars.includes(key));

  return hasModifier && hasNormalKey;
};

export interface Options {
  onClean?: () => void;
  onConfirm?: (validHotkey: Set<string>) => void;
}

/**
 * Record hotkey from input element
 * @see https://github.com/Wxh16144/react-record-hotkey.git
 * @example
 * ```tsx
 * const [inputRef, keys, { start, stop, isRecording }] = useRecordHotkey({
 *  onClean: () => {
 *    console.log('Clean');
 *  },
 *  onConfirm: (hotkey) => {
 *    console.log(`Hotkey: ${Array.from(hotkey).join('+')}`);
 *  },
 * });
 *
 * return (
 *  <div>
 *   <input ref={inputRef} />
 *   <button onClick={start}>Start</button>
 *   <button onClick={stop}>Stop</button>
 *   <p>Recording: {isRecording ? 'Yes' : 'No'}</p>
 *   <p>Hotkey: {Array.from(keys).join('+')}</p>
 * </div>
 * );
 * ```
 **/
const useRecordHotkey = <InputEL extends HTMLInputElement>(opt?: Options) => {
  const { onClean, onConfirm } = opt || {};
  const ref = useRef<InputEL>(null);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);

  const start = React.useCallback(() => {
    setKeys(new Set());
    setIsRecording(true);
    ref.current?.focus?.();
  }, []);

  const stop = React.useCallback(() => {
    setKeys(new Set());
    setIsRecording(false);
    ref.current?.blur?.();
  }, []);

  const isValid = verify(keys);

  useEventListener(
    'blur',
    () => {
      setIsRecording(false);

      if (isValid) {
        onConfirm?.(keys);
      } else {
        onClean?.();
      }
    },
    { target: ref },
  );

  // useEventListener('focus', start, { target: ref });

  useEventListener(
    'keydown',
    (event) => {
      if (!isRecording) return;

      event.stopPropagation();
      event.preventDefault();

      const someModifierIsPressed = MODIFIERS.some((key) => event[`${key}Key`]);
      const key = mapKey(event.code);

      if (['escape', 'enter'].includes(key) && !someModifierIsPressed) {
        setIsRecording(false);
        event.target?.blur?.();

        return;
      }

      // Define allowed keys
      const keyIsAlphaNum = event.keyCode >= 48 && event.keyCode <= 90; // 48-90 is a-z, A-Z, 0-9
      const keyIsBetweenF1andF12 = event.keyCode >= 112 && event.keyCode <= 123; // 112-123 is F1-F12
      const keyIsAllowedChar = allowedChars.includes(key);

      const modifiers = new Set(MODIFIERS.filter((key) => event[`${key}Key`]));

      if (modifiers.size > 0) {
        const normalKey = (keyIsAlphaNum || keyIsBetweenF1andF12 || keyIsAllowedChar) && key;
        setKeys(new Set([...Array.from(modifiers), normalKey].filter(Boolean) as string[]));
      } else {
        setKeys(new Set());
      }
    },
    { target: ref },
  );

  return [ref, keys, { start, stop, isRecording }] as const;
};

export default useRecordHotkey;