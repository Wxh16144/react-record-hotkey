import { fireEvent, render } from '@test/utils';
import { ConfigProvider } from 'antd';
import ActionIcon from '../ActionIcon';

const Icon = () => <svg>o</svg>;

describe('ActionIcon', () => {
  it('should render correctly', () => {
    const { container } = render(<ActionIcon icon={<Icon />} />);
    expect(container).toMatchSnapshot();
  });

  it('should render with className', () => {
    const { getByRole } = render(<ActionIcon icon={<Icon />} className="test" />);
    expect(getByRole('button')).toHaveClass('test');
  });

  it('should render with onClick', () => {
    const onClick = vi.fn();
    const { getByRole } = render(<ActionIcon icon={<Icon />} onClick={onClick} />);
    fireEvent.click(getByRole('button'));
    expect(onClick).toBeCalled();
  });

  describe('disabled', () => {
    it('should render with disabled', () => {
      const onClick = vi.fn();
      const { getByRole } = render(<ActionIcon icon={<Icon />} disabled onClick={onClick} />);
      expect(getByRole('button')).toBeDisabled();
      fireEvent.click(getByRole('button'));
      expect(onClick).not.toBeCalled();
    });

    it('should render with disabled by antd ConfigProvider', () => {
      const { getByRole } = render(
        <ConfigProvider componentDisabled>
          <ActionIcon icon={<Icon />} />,
        </ConfigProvider>,
      );
      expect(getByRole('button')).toBeDisabled();
    });
  });

  it('should render with style', () => {
    const { getByRole } = render(<ActionIcon icon={<Icon />} style={{ color: 'red' }} />);
    expect(getComputedStyle(getByRole('button')).color).toBe('rgb(255, 0, 0)');
  });

  describe('size', () => {
    it('should render', () => {
      const { getByRole } = render(<ActionIcon icon={<Icon />} size="large" />);
      expect(getByRole('button')).toHaveClass('ant-btn-lg');
      expect(getComputedStyle(getByRole('button')).maxHeight).toBeFalsy();
    });

    it.each([void 0, 'small', 'middle'])('should render with size %s', (size: any) => {
      const { getByRole } = render(<ActionIcon icon={<Icon />} size={size} />);
      expect(getComputedStyle(getByRole('button')).maxHeight).toBeTruthy();
    });

    it('overwrites max-height', () => {
      const { getByRole } = render(
        <ActionIcon icon={<Icon />} size="small" style={{ maxHeight: 100 }} />,
      );
      expect(getComputedStyle(getByRole('button')).maxHeight).toBe('100px');
    });

    it('should render with size by antd ConfigProvider', () => {
      const { getByRole } = render(
        <ConfigProvider componentSize="small">
          <ActionIcon icon={<Icon />} />,
        </ConfigProvider>,
      );
      expect(getByRole('button')).toHaveClass('ant-btn-sm');
      expect(getComputedStyle(getByRole('button')).maxHeight).toBeTruthy();
    });
  });
});
