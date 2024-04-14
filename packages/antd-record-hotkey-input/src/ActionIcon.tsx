import type { ButtonProps, TooltipProps } from 'antd';
import { Button, Tooltip } from 'antd';
import cx from 'clsx';
import type { CSSProperties } from 'react';
import { useContext } from 'react';
import { ConfigContext, DisabledContext, SizeContext } from './context';

export interface ActionIconProps extends Omit<ButtonProps, 'title'> {
  title?: TooltipProps['title'];
  cursor?: CSSProperties['cursor'];
  placement?: TooltipProps['placement'];
  icon?: ButtonProps['icon'];
}

const ActionIcon = (props: ActionIconProps) => {
  const { placement, title, icon, cursor, disabled, style, className, size, ...restProps } = props;

  const ctxDisabled = useContext(DisabledContext);
  const mergedDisabled = disabled ?? ctxDisabled;

  const ctxSize = useContext(SizeContext);
  const mergedSize = size ?? ctxSize;

  const { getPrefixCls } = useContext(ConfigContext);

  const prefixCls = getPrefixCls('action-icon');
  const cls = cx(className, prefixCls);

  const btnStyle: React.CSSProperties = {
    /**
     * 这里期望的是开发者传递给 suffix 时不出现抖动问题。
     * 当然开发者可以通过 style 覆盖这个样式。
     */
    ...(mergedSize !== 'large' ? { maxHeight: 22 } : {}),
    ...style,
    cursor,
  };

  let iconNode = (
    <Button
      icon={icon}
      style={btnStyle}
      disabled={mergedDisabled}
      className={cls}
      size={mergedSize}
      {...restProps}
    />
  );

  if (title && !mergedDisabled) {
    iconNode = (
      <Tooltip arrow={false} title={title} placement={placement}>
        {iconNode}
      </Tooltip>
    );
  }

  return iconNode;
};

export default ActionIcon;
