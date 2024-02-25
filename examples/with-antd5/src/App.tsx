import { Empty, message } from 'antd';
import RecordShortcutInput from 'antd-record-hotkey-input';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import WithI18n from './WithI18n';
import './style.css';

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
        allowClear
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

export default () => (
  <WithI18n>
    <App />
  </WithI18n>
);
