import { CloseCircleFilled, EditOutlined } from '@ant-design/icons';
import { useControllableValue, useUpdateEffect } from 'ahooks';
import type { InputProps } from 'antd';
import { Input, Space, Tag } from 'antd';
import type { InputRef } from 'antd/es/input';
import { composeRef } from 'rc-util/lib/ref';
import React from 'react';
import useRecordHotkey from 'react-use-record-hotkey';
import ActionIcon from './ActionIcon';
import defaultFormatShortcut from './formatShortcut';
import { useIntl } from './intl';

export interface RecordShortcutInputProps
  extends Omit<InputProps, 'readOnly' | 'onChange' | 'value' | 'suffix' | 'defaultValue'> {
  defaultValue?: string;
  onChange?: (shortcut: string) => void;
  /**
   * 格式化快捷键显示， 比如 mac 下的 command 键显示为 ⌘
   * @default (shortcut) => shortcut
   */
  formatShortcut?: (shortcut: string) => string;
}

const internalFormatShortcut = (keys: Set<string>) => {
  return Array.from(keys).join(' + ');
};

/**
 * 快捷键编辑器
 * @description 合法的快捷键格式为：`ctrl + shift + a` （即必须包含修饰键和一个普通键）
 * @rules
 * -  允许点击清除按钮清除快捷键
 * -  点击编辑按钮后，进入编辑状态（输入框自动聚焦）此时输入框会显示为黄色
 * -  按下任意键组合后显示在输入框中（必须是合法的快捷键）
 *
 * -  如果按下的是 ESC 键，退出编辑状态
 * -  如果按下的是 Enter 键或者输入框失去焦点，退出编辑状态，判断此时输入框中的内容是合法的快捷键
 * -  如果是合法的快捷键，调用 onChange 并传入此快捷键
 * -  如果不是合法的快捷键，调恢复输入框中的内容为上一次的快捷键
 */
function RecordShortcutInput(props: RecordShortcutInputProps, ref: React.ForwardedRef<InputRef>) {
  const {
    status,
    defaultValue: propsDefaultValue,
    onChange,
    placeholder,
    allowClear,
    formatShortcut = defaultFormatShortcut,
    onDoubleClick,
    ...restProps
  } = props;
  const t = useIntl().getMessage;

  const [internalValue, setInternalValue] = React.useState(propsDefaultValue ?? '');

  const [value, setValue] = useControllableValue<string>({
    defaultValue: internalValue,
    onChange,
  });

  const [inputRef, keys, { isRecording, start }] = useRecordHotkey({
    onConfirm: (keys) => setValue(internalFormatShortcut(keys)),
    onClean: () => setInternalValue(value),
  });

  const shortcut = React.useMemo(() => internalFormatShortcut(keys), [keys]);

  useUpdateEffect(() => {
    if (isRecording) setInternalValue(shortcut);
  }, [shortcut, isRecording]);

  const bindInputRef = React.useCallback((el: InputRef) => {
    (inputRef.current as any) = el?.input;
  }, []);

  let actions: React.ReactNode[] = [
    <ActionIcon
      key="edit"
      size="small"
      onClick={start}
      type="text"
      title={t('ShortcutInput.edit', 'Edit')}
      icon={<EditOutlined />}
    />,
    allowClear && (
      <ActionIcon
        key="clear"
        size="small"
        onClick={(event) => {
          event.stopPropagation();
          setValue('');
          setInternalValue('');
        }}
        type="text"
        title={t('ShortcutInput.clear', 'Clear')}
        icon={<CloseCircleFilled />}
      />
    ),
  ].filter(Boolean);

  if (actions.length > 1) {
    actions = [<Space.Compact key="actions">{actions}</Space.Compact>];
  }

  const mergedSuffix = isRecording ? (
    <Tag style={{ margin: 0 }} color="warning">
      {t('ShortcutInput.recording', 'Recording...')}
    </Tag>
  ) : (
    actions
  );

  const mergedPlaceholder =
    placeholder ?? t('ShortcutInput.placeholder', 'Press any key to set shortcut');

  const mergedStatus = status ?? (isRecording ? 'warning' : status);

  const handleDoubleClick: typeof onDoubleClick = (e) => {
    onDoubleClick?.(e);
    if (isRecording) return;
    start();
  };

  return (
    <Input
      readOnly
      {...restProps}
      ref={composeRef(bindInputRef, ref)}
      value={formatShortcut(internalValue)}
      placeholder={mergedPlaceholder}
      suffix={mergedSuffix}
      status={mergedStatus}
      onDoubleClick={handleDoubleClick}
    />
  );
}

const ForwardedRecordShortcutInput = React.forwardRef(RecordShortcutInput);
export default React.memo(ForwardedRecordShortcutInput);
