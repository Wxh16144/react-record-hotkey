import { App as AntdApp, ConfigProvider, Divider, Radio, Space, version } from 'antd';
import { Locale } from 'antd/es/locale';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import React from 'react';

const isV5 = version.startsWith('5');

const WithI18n = ({ children }: React.PropsWithChildren) => {
  const [locale, setLocal] = React.useState<Locale>(enUS);

  const Wrap = isV5 && AntdApp !== undefined ? AntdApp : React.Fragment;

  const CPprops = {
    locale,
    ...(isV5 ? { theme: { cssVar: true } } : {}),
    children: <Wrap>{children}</Wrap>,
  };

  return (
    <div className="root">
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
      <ConfigProvider {...CPprops} />
    </div>
  );
};

export default WithI18n;
