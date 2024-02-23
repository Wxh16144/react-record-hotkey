import { ConfigProvider, Divider, Empty, Radio, Space, message } from 'antd';
import RecordShortcutInput from 'antd-record-hotkey-input';
import { Locale } from 'antd/es/locale';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import './style.css';

const WithI18n = ({ children }: React.PropsWithChildren) => {
  const [locale, setLocal] = useState<Locale>(enUS);

  return (
    <>
      <Space>
        <Radio.Group value={locale} onChange={(e) => setLocal(e.target.value)}>
          <Radio.Button key="en" value={enUS}>
            English
          </Radio.Button>
          <Radio.Button key="cn" value={zhCN}>
            中文
          </Radio.Button>
        </Radio.Group>
      </Space>
      <Divider />
      <ConfigProvider locale={locale}>{children}</ConfigProvider>
    </>
  );
};

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
      <div className="root">
        <RecordShortcutInput
          style={{ width: 500 }}
          defaultValue={shortcut}
          onChange={(value) => {
            console.log('快捷键变更为：', value);
            setShortcut(value);
          }}
        />

        <br />
        {shortcut ? (
          <div tabIndex={-1} className="container" ref={shortRef}>
            点击聚焦，测试快捷键：{shortcut}
          </div>
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
};

export default () => (
  <WithI18n>
    <App />
  </WithI18n>
);
