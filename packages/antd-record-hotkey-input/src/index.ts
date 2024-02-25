import RecordShortcutInput from './RecordShortcutInput';

export default RecordShortcutInput;
export { RecordShortcutInput };

// 暴露给外部，方便二次封装
export { useRecordHotkey } from 'react-use-record-hotkey';
export { default as ActionIcon } from './ActionIcon';
export { default as formatShortcut } from './formatShortcut';

// types
export type { ActionIconProps } from './ActionIcon';
export * from './type';
