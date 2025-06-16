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
  'up',
  'down',
  'left',
  'right',
];

const verify = (hotkey: Set<string>) => {
  const hasModifier = MODIFIERS.some((modifier) => hotkey.has(modifier));
  const hasNormalKey = Array.from(hotkey).some((key) => !MODIFIERS.includes(key));

  return hasModifier && hasNormalKey;
};

// #region record-option
export interface Options {
  onClean?: () => void;
  onConfirm?: (validHotkey: Set<string>) => void;
  /**
   * 是否键入回车键后开始录制
   * @default true
   */
  startOnEnter?: boolean;
}
// #endregion record-option

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
 * const hotkey = Array.from(keys).join('+');
 *
 * return (
 *  <div>
 *   <input ref={inputRef} autoFocus readOnly value={hotkey} />
 *   <button onClick={start}>Start</button>
 *   <button onClick={stop}>Stop</button>
 *   <p>Recording: {isRecording ? 'Yes' : 'No'}</p>
 *   <p>Hotkey: {hotkey}</p>
 * </div>
 * );
 * ```
 **/
const useRecordHotkey = <InputEL extends HTMLInputElement>(opt?: Options) => {
  const { onClean, onConfirm, startOnEnter = true } = opt || {};
  const ref = useRef<InputEL | null>(null);
  const blurRef = useRef<'escape' | 'enter' | null>();
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);

  const reset = () => {
    setKeys(new Set());
    blurRef.current = null;
  };

  const start = React.useCallback(() => {
    reset();
    setIsRecording(true);
    ref.current?.focus?.();
  }, []);

  const stop = React.useCallback(() => {
    reset();
    setIsRecording(false);
    ref.current?.blur?.();
  }, []);

  const isValid = verify(keys);

  useEventListener(
    'blur',
    () => {
      setIsRecording(false);

      if (isValid && blurRef.current !== 'escape') {
        onConfirm?.(keys);
      } else {
        onClean?.();
        reset();
      }

      blurRef.current = null;
    },
    { target: ref },
  );

  // useEventListener('focus', start, { target: ref });

  useEventListener(
    'keydown',
    (event) => {
      const key = mapKey(event.code);

      const someModifierIsPressed = MODIFIERS.some((key) => event[`${key}Key`]);

      if (!isRecording) {
        if (key === 'enter' && startOnEnter) {
          start();
        }
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      if (['escape', 'enter'].includes(key) && !someModifierIsPressed) {
        setIsRecording(false);
        blurRef.current = key as 'escape' | 'enter';
        event.target?.blur?.();

        return;
      }

      // Define allowed keys
      const keyIsAlphaNum = event.keyCode >= 48 && event.keyCode <= 90; // 48-90 is a-z, A-Z, 0-9
      const keyIsBetweenF1andF12 = event.keyCode >= 112 && event.keyCode <= 123; // 112-123 is F1-F12
      // TODO: Should be deleted. assign: @Wuxh<wxh1220@gmail.com>
      globalThis.console.log('%c@Wuxh(Red)', 'color:#21c17d;', {
        __x__: '912483',
        key,
      });

      const keyIsAllowedChar = allowedChars.includes(key);

      const modifiers = new Set(MODIFIERS.filter((key) => event[`${key}Key`]));

      if (modifiers.size > 0) {
        const normalKey = (keyIsAlphaNum || keyIsBetweenF1andF12 || keyIsAllowedChar) && key;
        setKeys(new Set([...Array.from(modifiers), normalKey].filter(Boolean) as string[]));
      } else {
        reset();
      }
    },
    { target: ref },
  );

  return [ref, keys, { start, stop, reset, isRecording }] as const;
};

export default useRecordHotkey;
