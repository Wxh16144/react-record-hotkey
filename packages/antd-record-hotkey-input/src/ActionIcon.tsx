import type { ButtonProps, TooltipProps } from 'antd';
import { Button, Tooltip } from 'antd';
import cx from 'clsx';
import type { CSSProperties } from 'react';
import { useContext } from 'react';
import { ConfigContext, DisabledContext } from './context';

export interface ActionIconProps extends Omit<ButtonProps, 'title'> {
  title?: TooltipProps['title'];
  cursor?: CSSProperties['cursor'];
  placement?: TooltipProps['placement'];
  icon?: ButtonProps['icon'];
}

const ActionIcon = (props: ActionIconProps) => {
  const { placement, title, icon, cursor, disabled, style, className, ...restProps } = props;

  const ctxDisabled = useContext(DisabledContext);
  const mergedDisabled = disabled ?? ctxDisabled;

  const { getPrefixCls } = useContext(ConfigContext);

  const prefixCls = getPrefixCls('action-icon');
  const cls = cx(className, prefixCls);

  let iconNode = (
    <Button
      icon={icon}
      style={{ ...style, cursor }}
      disabled={mergedDisabled}
      className={cls}
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
