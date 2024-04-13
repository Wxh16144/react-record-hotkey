import type { ButtonProps, TooltipProps } from 'antd';
import { Button, Tooltip } from 'antd';
import type { CSSProperties } from 'react';
import { useContext } from 'react';
import { DisabledContext } from './context';

export interface ActionIconProps extends Omit<ButtonProps, 'title'> {
  title?: TooltipProps['title'];
  cursor?: CSSProperties['cursor'];
  placement?: TooltipProps['placement'];
  icon?: ButtonProps['icon'];
}

const ActionIcon = (props: ActionIconProps) => {
  const { placement, title, icon, cursor, disabled, style, ...restProps } = props;
  const ctxDisabled = useContext(DisabledContext);
  const mergedDisabled = disabled ?? ctxDisabled;

  let iconNode = (
    <Button icon={icon} style={{ ...style, cursor }} disabled={mergedDisabled} {...restProps} />
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
