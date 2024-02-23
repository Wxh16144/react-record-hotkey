import useRecordHotkeyDefault, { useRecordHotkey } from 'react-use-record-hotkey';

describe('useRecordHotkey', () => {
  it('should be a function', () => {
    expect(useRecordHotkeyDefault).toBeInstanceOf(Function);
    expect(useRecordHotkey).toBe(useRecordHotkeyDefault);
  });
});
