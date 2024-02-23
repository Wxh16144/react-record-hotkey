import type { ButtonProps, TooltipProps } from 'antd';
import { Button, Tooltip } from 'antd';
import type { CSSProperties } from 'react';

export interface ActionIconProps extends Omit<ButtonProps, 'title'> {
  title?: TooltipProps['title'];
  cursor?: CSSProperties['cursor'];
  placement?: TooltipProps['placement'];
  icon?: ButtonProps['icon'];
}

const ActionIcon = (props: ActionIconProps) => {
  const { placement, title, icon, cursor, onClick, ...restProps } = props;
  let iconNode = <Button icon={icon} style={{ cursor }} {...restProps} onClick={onClick} />;

  if (title) {
    iconNode = (
      <Tooltip arrow={false} title={title} placement={placement}>
        {iconNode}
      </Tooltip>
    );
  }

  return iconNode;
};

export default ActionIcon;
