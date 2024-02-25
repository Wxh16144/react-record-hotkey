import type { StandardProps } from 'ahooks/es/useControllableValue';
import type { InputProps } from 'antd';

type MaybeFunction<T> = T | ((isRecording: boolean) => T);

type ShortcutStandardOptions = StandardProps<string>;
type RealInputProps = Omit<
  InputProps,
  'readOnly' | 'suffix' | 'status' | 'placeholder' | keyof ShortcutStandardOptions
>;

export type { InputRef } from 'antd/es/input';
export interface RecordShortcutInputProps extends RealInputProps, Partial<ShortcutStandardOptions> {
  status?: MaybeFunction<InputProps['status']>;
  placeholder?: MaybeFunction<InputProps['placeholder']>;
  /**
   * 格式化快捷键显示，例如 mac 下的 command 键显示为 ⌘;
   * 默认：[defaultFormatShortcut](https://github.com/Wxh16144/react-record-hotkey/blob/master/packages/antd-record-hotkey-input/src/formatShortcut.ts)
   * @default defaultFormatShortcut
   */
  formatShortcut?: (shortcut: string) => string;
  onConfirm?: (shortcut: string) => void;
}
