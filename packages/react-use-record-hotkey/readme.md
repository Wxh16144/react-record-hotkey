# react-use-record-hotkey

> 录制键盘快捷键 Hook

[![NPM version][npm-image]][npm-url] [![NPM downloads][download-image]][download-url] [![install size][npm-size]][npm-size-url]

<!-- npm url -->

[npm-image]: http://img.shields.io/npm/v/react-use-record-hotkey.svg?style=flat-square&color=deepgreen&label=latest
[npm-url]: http://npmjs.org/package/react-use-record-hotkey
[npm-size]: https://img.shields.io/bundlephobia/minzip/react-use-record-hotkey?color=deepgreen&label=gizpped%20size&style=flat-square
[npm-size-url]: https://packagephobia.com/result?p=react-use-record-hotkey

## Install

```bash
npm i react-use-record-hotkey -S
```

## Usage

```tsx
import { useRecordHotkey } from 'react-use-record-hotkey';

const App = () => {
  const [inputRef, keys, { start, stop, isRecording }] = useRecordHotkey({
    onClean: () => {
      console.log('Clean');
    },
    onConfirm: (hotkey) => {
      console.log(`Hotkey: ${Array.from(hotkey).join('+')}`);
    },
  });

  const hotkey = Array.from(keys).join('+');

  return (
    <div>
      <input ref={inputRef} autoFocus readOnly value={hotkey} />
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <p>Recording: {isRecording ? 'Yes' : 'No'}</p>
      <p>Hotkey: {hotkey}</p>
    </div>
  );
};

export default App;
```
