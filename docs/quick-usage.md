---
title: antd-record-hotkey-input
nav:
  order: 1
  title: Quick Usage
---

## Hook

### Install

```bash
npm i antd-record-hotkey-input -S
```

### Example

<<< ../examples/react-hooks/src/App.tsx

### Interface

```tsx | pure
export interface Options {
  onClean?: () => void;
  onConfirm?: (validHotkey: Set<string>) => void;
}
```
