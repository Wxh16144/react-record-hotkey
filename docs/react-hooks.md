---
title: React Hook
nav:
  order: 2
---

<code src="../examples/react-hooks/src/App.tsx"></code>

### Interface

```tsx | pure
export interface Options {
  onClean?: () => void;
  onConfirm?: (validHotkey: Set<string>) => void;
}
```
