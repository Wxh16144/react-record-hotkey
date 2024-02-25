import RecordShortcutInputDefault, {
  ActionIcon,
  RecordShortcutInput,
  formatShortcut,
  useRecordHotkey,
} from 'antd-record-hotkey-input';

it('export should be correct', () => {
  expect(RecordShortcutInputDefault).toBeDefined();
  expect(RecordShortcutInput).toBe(RecordShortcutInputDefault);

  expect(useRecordHotkey).toBeDefined();
  expect(ActionIcon).toBeDefined();
  expect(formatShortcut).toBeInstanceOf(Function);
});

describe('formatShortcut', () => {
  it.each([
    ['backquote', '`'],
    ['minus', '-'],
    ['plus', '+'],
    ['equal', '='],
    ['bracketleft', '['],
    ['bracketright', ']'],
    ['semicolon', ';'],
    ['quote', "'"],
    ['comma', ','],
    ['period', '.'],
    ['slash', '/'],
    ['backslash', '\\'],
  ])('format `%s`', (key, expected) => {
    expect(formatShortcut(key)).toBe(expected);
  });

  // todo: fix isMacOS
  describe('macOS', () => {
    it.skip.each([
      ['alt', 'Option'],
      ['ctrl', 'Control'],
      ['shift', 'Shift'],
      ['meta', 'Command'],
    ])('format `%s`', (key, expected) => {
      expect(formatShortcut(key)).toBe(expected);
    });
  });
});
