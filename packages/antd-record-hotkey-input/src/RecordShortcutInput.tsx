import { CloseCircleFilled, EditOutlined } from '@ant-design/icons';
import { Input, Space, Tag } from 'antd';
import cx from 'clsx';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { composeRef } from 'rc-util/lib/ref';
import React from 'react';
import useRecordHotkey from 'react-use-record-hotkey';
import ActionIcon, { type ActionIconProps } from './ActionIcon';
import { ConfigContext, DisabledContext } from './context';
import defaultFormatShortcut from './formatShortcut';
import { useIntl } from './intl';
import type { InputRef, RecordShortcutInputProps } from './type';
import useUpdateEffect from './useUpdateEffect';

const internalFormatShortcut = (keys: Set<string>) => {
  return Array.from(keys).join(' + ');
};

// #region shortcut-rules
/**
 * ## 快捷键编辑输入框
 *
 * > 合法的快捷键格式为: `ctrl + shift + a`  (即必须包含修饰键和一个普通键）
 *
 * ### 快捷键规则
 * -  允许点击清除按钮清除快捷键。
 * -  允许点击编辑按钮/双击输入框/输入框内回车进入编辑状态 (输入框自动聚焦) 此时输入框会显示为黄色。
 * -  按下任意合法键组后将会显示在输入框中。
 *
 * -  如果按下的是 ESC 键，退出编辑状态。
 * -  如果按下的是 Enter 键或者输入框失去焦点，退出编辑状态，判断此时输入框中的内容是合法的快捷键。
 * -  如果是合法的快捷键，调用 onChange 并传入此快捷键。
 * -  如果不是合法的快捷键，将恢复输入框中的内容为上一次的快捷键。
 *
 * ### FAQ
 * - [如何搭配 antd Form 使用?](https://github.com/Wxh16144/react-record-hotkey/blob/master/docs/examples/antd-form.tsx)
 */
// #endregion shortcut-rules
function RecordShortcutInput(props: RecordShortcutInputProps, ref: React.ForwardedRef<InputRef>) {
  const {
    // === controlled ===
    value: propValue,
    defaultValue: propDefaultValue,
    onChange: propOnChange,
    // === overwrite ===
    status,
    placeholder,
    // === antd ===
    className,
    allowClear,
    suffix,
    onDoubleClick,
    disabled,
    // === append ===
    formatShortcut = defaultFormatShortcut,
    onConfirm,
    recordOption,
    locale,
    ...restProps
  } = props;
  const ctxDisabled = React.useContext(DisabledContext);
  const mergedDisabled = disabled ?? ctxDisabled;

  const { getPrefixCls } = React.useContext(ConfigContext);

  const intl = useIntl();
  const t = React.useCallback<(typeof intl)['getMessage']>(
    (id, defaultMessage) => {
      const _id = id.replace(/^ShortcutInput\./, '') as keyof typeof locale;
      // eslint-disable-next-line eqeqeq
      if (locale?.[_id] != null) return locale[_id];
      return intl.getMessage(id, defaultMessage);
    },
    [intl, locale],
  );

  const [value, setValue] = useMergedState<string>('', {
    value: propValue,
    defaultValue: propDefaultValue,
    onChange: propOnChange,
  });

  const [internalValue, setInternalValue] = React.useState<string>(value);

  const [inputRef, keys, { isRecording, start, reset }] = useRecordHotkey({
    ...recordOption,
    onConfirm: (keys) => {
      const finalKeys = internalFormatShortcut(keys);
      setInternalValue(finalKeys);
      setValue(finalKeys);
      onConfirm?.(finalKeys);
    },
    onClean: () => setValue(internalValue),
  });

  const shortcut = React.useMemo(() => internalFormatShortcut(keys), [keys]);

  useUpdateEffect(() => {
    if (isRecording) setValue(shortcut);
  }, [shortcut, isRecording]);

  const bindInputRef = React.useCallback((el: InputRef) => {
    inputRef.current = el?.input;
  }, []);

  const baseActionProps: ActionIconProps = {
    size: 'small',
    type: 'text',
    disabled: mergedDisabled,
  };

  let actions: React.ReactNode[] = [
    <ActionIcon
      {...baseActionProps}
      key="edit"
      onClick={start}
      title={t('ShortcutInput.edit', 'Edit')}
      icon={<EditOutlined />}
    />,
    allowClear && (
      <ActionIcon
        {...baseActionProps}
        key="clear"
        onClick={(event) => {
          event.stopPropagation();
          reset();
          setValue('');
          setInternalValue('');
          onConfirm?.('');
        }}
        title={t('ShortcutInput.clear', 'Clear')}
        icon={<CloseCircleFilled />}
      />
    ),
    ...(Array.isArray(suffix) ? suffix : [suffix]),
  ].filter(Boolean);

  if (actions.length > 1) {
    actions = [
      <Space.Compact
        key="actions"
        /**
         * 4.x 会被 Space.Compact 的 size 默认值 middle 影响（导致按钮变大）
         * https://github.com/ant-design/ant-design/issues/42724#issuecomment-2053064620
         * https://github.com/ant-design/ant-design/blob/c6116fad2a42ed77b5ac67204e0bc703b283ce80/components/button/button.tsx#L243
         */
        size="small"
      >
        {actions}
      </Space.Compact>,
    ];
  }

  const mergedSuffix = isRecording ? (
    /**
     * Tag 组件的 bordered={false} 是 5.x 的 API
     * 这里为了兼容 4.x，直接使用 style borderWidth 覆盖。
     */
    <Tag style={{ margin: 0, borderWidth: 0 }} color="warning" /** bordered={false} */>
      {t('ShortcutInput.recording', 'Recording...')}
    </Tag>
  ) : (
    actions
  );

  const mergedPlaceholder = (function () {
    if (typeof placeholder === 'function') {
      return placeholder(isRecording);
    }

    return (
      placeholder ??
      (isRecording
        ? t('ShortcutInput.recordingPlaceholder', 'Press any key combination')
        : t('ShortcutInput.placeholder', 'Double click to edit'))
    );
  })();

  const mergedStatus = (function () {
    if (typeof status === 'function') {
      return status(isRecording);
    }
    return status ?? (isRecording ? 'warning' : status);
  })();

  const handleDoubleClick: typeof onDoubleClick = (e) => {
    onDoubleClick?.(e);
    if (isRecording) return;
    start();
  };

  const prefixCls = getPrefixCls('record-hotkey-input');
  const cls = cx(className, prefixCls, {
    [`${prefixCls}-disabled`]: mergedDisabled,
    [`${prefixCls}-recording`]: isRecording,
  });

  return (
    <DisabledContext.Provider value={mergedDisabled}>
      <Input
        {...restProps}
        readOnly
        className={cls}
        ref={composeRef(bindInputRef, ref)}
        value={formatShortcut(value)}
        placeholder={mergedPlaceholder}
        suffix={mergedSuffix}
        status={mergedStatus}
        onDoubleClick={handleDoubleClick}
      />
    </DisabledContext.Provider>
  );
}

const ForwardedRecordShortcutInput = React.forwardRef(RecordShortcutInput);
export default React.memo(ForwardedRecordShortcutInput);
