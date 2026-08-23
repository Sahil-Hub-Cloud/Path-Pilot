import { useEffect, useCallback, useRef } from 'react';

export interface ShortcutAction {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  handler: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutAction[], enabled = true) {
  const handlerMap = useRef(new Map<string, () => void>());

  useEffect(() => {
    shortcuts.forEach(s => {
      const id = `${s.ctrl ? 'C' : ''}${s.shift ? 'S' : ''}${s.alt ? 'A' : ''}${s.key}`;
      handlerMap.current.set(id, s.handler);
    });
  }, [shortcuts]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase() || e.code === shortcut.key;
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !(e.ctrlKey || e.metaKey);
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          if (isInput && !shortcut.ctrl) continue;
          e.preventDefault();
          e.stopPropagation();
          shortcut.handler();
          return;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [handleKeyDown]);
}

export const DEFAULT_SHORTCUTS_INFO = [
  { keys: 'Ctrl+S', description: 'Save all files' },
  { keys: 'Ctrl+Enter', description: 'Run code' },
  { keys: 'Ctrl+Shift+Enter', description: 'Submit solution' },
  { keys: 'Ctrl+N', description: 'New file' },
  { keys: 'Ctrl+W', description: 'Close tab' },
  { keys: 'Ctrl+`', description: 'Toggle terminal' },
  { keys: 'Ctrl+B', description: 'Toggle sidebar' },
  { keys: 'Ctrl+\\', description: 'Split editor' },
  { keys: 'F11', description: 'Fullscreen editor' },
  { keys: 'Ctrl+K', description: 'Command palette' },
];
