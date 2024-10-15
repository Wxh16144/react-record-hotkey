import { fireEvent, render, waitFakeTimer } from '@test/utils';
import { ConfigProvider } from 'antd';
import en_US from 'antd/locale/en_US';
import zh_CN from 'antd/locale/zh_CN';
import RecordShortcutInput from '../RecordShortcutInput';

// 抽离一个录制快捷键的测试用例
async function recordShortcut(input: HTMLElement, container: HTMLElement) {
  fireEvent.dblClick(input); // 双击输入框进入编辑模式

  await waitFakeTimer();

  expect(container.querySelector('.ant-record-hotkey-input-recording')).toBeInTheDocument();

  // 按下 shift + a
  fireEvent.keyDown(input, { keyCode: 16, shiftKey: true, code: 'ShiftLeft' });
  fireEvent.keyDown(input, { keyCode: 65, shiftKey: true, code: 'KeyA' });

  // 按下回车结束录制
  fireEvent.keyDown(input, { keyCode: 13, code: 'Enter' });

  expect(input).toHaveValue('Shift + A');
}

describe('RecordShortcutInput', () => {
  it('should render correctly', () => {
    const { container } = render(<RecordShortcutInput />);
    expect(container).toMatchSnapshot();
  });

  it('正常录制快捷键', async () => {
    const { getByRole, container } = render(<RecordShortcutInput />);

    const input = getByRole('textbox');

    expect(input).toBeInTheDocument();

    await recordShortcut(input, container);
  });

  it('should clear value when click clear icon', async () => {
    const { getByRole, getAllByRole, container } = render(<RecordShortcutInput allowClear />);
    const input = getByRole('textbox');

    await recordShortcut(input, container);

    expect(getAllByRole('button')).toHaveLength(2);

    // 点击清除按钮
    fireEvent.click(getAllByRole('button').at(-1)!);
    expect(input).toHaveValue('');
  });

  it('should not record when disabled', async () => {
    const { getByRole, container } = render(<RecordShortcutInput disabled />);
    const input = getByRole('textbox');

    fireEvent.dblClick(input);

    await waitFakeTimer();

    // 断言输入框未进入录制状态
    expect(container.querySelector('.ant-record-hotkey-input-recording')).not.toBeInTheDocument();
  });

  it('should render placeholder correctly', () => {
    const { getByPlaceholderText } = render(<RecordShortcutInput placeholder="请输入快捷键" />);
    expect(getByPlaceholderText('请输入快捷键')).toBeInTheDocument();
  });

  it('should render placeholder function correctly', () => {
    const placeholder = vi.fn((recording) => (recording ? 'foo' : 'bar'));
    const { getByRole } = render(<RecordShortcutInput placeholder={placeholder} />);

    const input = getByRole('textbox');

    expect(input).toHaveAttribute('placeholder', 'bar');

    fireEvent.dblClick(input);

    expect(input).toHaveAttribute('placeholder', 'foo');
  });

  describe('模拟录制一半退出', () => {
    it('should stop recording when blur', async () => {
      const { getByRole, container } = render(<RecordShortcutInput />);
      const input = getByRole('textbox');
      fireEvent.dblClick(input);

      await waitFakeTimer();

      expect(container.querySelector('.ant-record-hotkey-input-recording')).toBeInTheDocument();
      fireEvent.blur(input);
      fireEvent.keyDown(input, { keyCode: 16, shiftKey: true, code: 'ShiftLeft' });
      expect(container.querySelector('.ant-record-hotkey-input-recording')).not.toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('should stop recording when press esc', async () => {
      const { getByRole, container } = render(<RecordShortcutInput />);
      const input = getByRole('textbox');
      fireEvent.dblClick(input);

      await waitFakeTimer();

      expect(container.querySelector('.ant-record-hotkey-input-recording')).toBeInTheDocument();
      fireEvent.keyDown(input, { keyCode: 27, code: 'Escape' });
      expect(container.querySelector('.ant-record-hotkey-input-recording')).not.toBeInTheDocument();
      expect(input).toHaveValue('');
    });
  });

  describe('i18n', () => {
    it('should render correct i18n text', () => {
      const { getByRole } = render(<RecordShortcutInput />);
      expect(getByRole('textbox')).toHaveAttribute('placeholder', 'Double click to edit');
    });

    it('should render correct i18n text with ConfigProvider', () => {
      const { getByRole, rerender } = render(
        <ConfigProvider locale={zh_CN}>
          <RecordShortcutInput />
        </ConfigProvider>,
      );

      expect(getByRole('textbox')).toHaveAttribute('placeholder', '双击以编辑');

      rerender(
        <ConfigProvider locale={en_US}>
          <RecordShortcutInput />
        </ConfigProvider>,
      );

      expect(getByRole('textbox')).toHaveAttribute('placeholder', 'Double click to edit');
    });

    it('custom locale', () => {
      const { getByRole } = render(
        <RecordShortcutInput
          locale={{
            placeholder: 'foo',
          }}
        />,
      );
      expect(getByRole('textbox')).toHaveAttribute('placeholder', 'foo');
    });
  });
});
