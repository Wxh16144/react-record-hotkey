# antd-record-hotkey-input

> Ant Design 快捷键录制输入框

[![NPM version][npm-image]][npm-url] [![NPM downloads][download-image]][download-url] [![install size][npm-size]][npm-size-url]

<!-- npm url -->

[npm-image]: http://img.shields.io/npm/v/antd-record-hotkey-input.svg?style=flat-square&color=deepgreen&label=latest
[npm-url]: http://npmjs.org/package/antd-record-hotkey-input
[npm-size]: https://img.shields.io/bundlephobia/minzip/antd-record-hotkey-input?color=deepgreen&label=gizpped%20size&style=flat-square
[npm-size-url]: https://packagephobia.com/result?p=antd-record-hotkey-input
[download-image]: https://img.shields.io/npm/dm/antd-record-hotkey-input.svg?style=flat-square
[download-url]: https://npmjs.org/package/antd-record-hotkey-input

## Install

```bash
npm i antd-record-hotkey-input -S
```

## Usage

```tsx
import { Empty, message } from 'antd';
import RecordShortcutInput from 'antd-record-hotkey-input';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

const App = () => {
  const [shortcut, setShortcut] = useState('');

  const shortRef = useHotkeys<HTMLDivElement>(
    shortcut,
    () => {
      message.success('快捷键触发');
    },
    {
      preventDefault: true,
    },
  );

  return (
    <>
      <RecordShortcutInput
        style={{ width: 500 }}
        defaultValue={shortcut}
        onConfirm={(value) => {
          console.log('快捷键变更为：', value);
          setShortcut(value);
        }}
      />

      <div tabIndex={-1} className="container" ref={shortRef}>
        {shortcut ? <span>点击聚焦，测试快捷键：{shortcut}</span> : <Empty />}
      </div>
    </>
  );
};

export default App;
```
