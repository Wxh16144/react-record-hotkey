import type { InputProps } from 'antd';
import type { Options } from 'react-use-record-hotkey';
import type { LocaleType } from './locale/type';

type MaybeFunction<T> = T | ((isRecording: boolean) => T);

type StandardProps<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (val: T) => void;
};

type ShortcutStandardOptions = StandardProps<string>;
type RealInputProps = Omit<
  InputProps,
  'readOnly' | 'status' | 'placeholder' | keyof ShortcutStandardOptions
>;

export type { InputRef } from 'antd/es/input';
export interface RecordShortcutInputProps extends RealInputProps, ShortcutStandardOptions {
  status?: MaybeFunction<InputProps['status']>;
  placeholder?: MaybeFunction<InputProps['placeholder']>;
  /**
   * 格式化快捷键显示，例如 mac 下的 command 键显示为 ⌘;
   * 默认：[defaultFormatShortcut](https://github.com/Wxh16144/react-record-hotkey/blob/master/packages/antd-record-hotkey-input/src/formatShortcut.ts)
   * @default defaultFormatShortcut
   */
  formatShortcut?: (shortcut: string) => string;
  onConfirm?: (shortcut: string) => void;
  /**
   * Record hotkey options
   * @since 1.2.0
   */
  recordOption?: Omit<Options, 'onClean' | 'onConfirm'>;
  /**
   * @since 1.3.0
   */
  locale?: Partial<LocaleType['ShortcutInput']>;
}
