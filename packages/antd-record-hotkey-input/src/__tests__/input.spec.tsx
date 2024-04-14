import { fireEvent, render, waitFakeTimer } from '@test/utils';
import RecordShortcutInput from '../RecordShortcutInput';

describe('RecordShortcutInput', () => {
  it('should render correctly', () => {
    const { container } = render(<RecordShortcutInput />);
    expect(container).toMatchSnapshot();
  });

  it('正常录制快捷键', async () => {
    const { getByRole, container } = render(<RecordShortcutInput />);

    const input = getByRole('textbox');

    expect(input).toBeInTheDocument();

    fireEvent.dblClick(input); // 双击输入框进入编辑模式

    await waitFakeTimer();

    // 断言输入框进入录制状态
    expect(container.querySelector('.ant-record-hotkey-input-recording')).toBeInTheDocument();

    // 按下 shift + a
    fireEvent.keyDown(input, { keyCode: 16, shiftKey: true, code: 'ShiftLeft' });
    fireEvent.keyDown(input, { keyCode: 65, shiftKey: true, code: 'KeyA' });

    // 按下回车结束录制
    fireEvent.keyDown(input, { keyCode: 13, code: 'Enter' });

    // 断言输入框有内容
    expect(input).toHaveValue('Shift + A');
  });
});
