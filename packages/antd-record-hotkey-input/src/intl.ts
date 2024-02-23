/**
 * copy from: https://github.com/ant-design/pro-components/blob/beef05775051059d47c3d8ca60b888278695cc94/packages/provider/src/intl.ts
 */
import { ConfigProvider } from 'antd';
import { useContext } from 'react';
import enUS from './locale/en_US';
import zhCN from './locale/zh_CN';

/**
 * 安全的从一个对象中读取相应的值
 * @param source
 * @param path
 * @param defaultValue
 * @returns
 */
function get(
  source: Record<string, unknown>,
  path: string,
  defaultValue?: string,
): string | undefined {
  // a[3].b -> a.3.b
  const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let result = source;
  let message = defaultValue;
  // eslint-disable-next-line no-restricted-syntax
  for (const p of paths) {
    message = Object(result)[p];
    result = Object(result)[p];
    if (message === undefined) {
      return defaultValue;
    }
  }
  return message;
}

export type IntlType = {
  locale: string;
  getMessage: (id: PathType<typeof enUS>, defaultMessage: string) => string;
};

export type PathType<T> = T extends object
  ? {
      [K in keyof T]: K extends string ? `${K}` | `${K}.${PathType<T[K]>}` : never;
    }[keyof T]
  : never;

/**
 * 创建一个国际化的操作函数
 *
 * @param locale
 * @param localeMap
 */
export const createIntl = (locale: string, localeMap: Record<string, any>): IntlType => ({
  getMessage: (id: string, defaultMessage: string) =>
    get(localeMap, id, defaultMessage) || defaultMessage,
  locale,
});

export const zhCNIntl = createIntl('zh_CN', zhCN);
export const enUSIntl = createIntl('en_US', enUS);

export const intlMap = {
  'zh-CN': zhCNIntl,
  'en-US': enUSIntl,
} as const;

export const intlMapKeys = Object.keys(intlMap) as Array<keyof typeof intlMap>;

/**
 * 根据 antd 的 key 来找到的 locale 插件的 key
 *
 * @param localeKey
 */
export const findIntlKeyByAntdLocaleKey = <T extends string>(localeKey?: T) => {
  const localeName = (localeKey || 'en-US').toLocaleLowerCase();
  return intlMapKeys.find((intlKey) => {
    const LowerCaseKey = intlKey.toLocaleLowerCase();
    return LowerCaseKey.includes(localeName);
  }) as T;
};

/**
 * It returns the intl object from the context if it exists, otherwise it returns the intl object for
 * 获取国际化的方法
 * @param locale
 * @param localeMap
 * the current locale
 * @returns The return value of the function is the intl object.
 */
export function useIntl(): IntlType {
  const { locale } = useContext(ConfigProvider.ConfigContext);

  if (locale?.locale) {
    return intlMap[findIntlKeyByAntdLocaleKey(locale.locale) as 'en-US'] || enUSIntl;
  }

  return enUSIntl;
}
