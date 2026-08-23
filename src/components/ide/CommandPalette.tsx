'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCode, FiPlay, FiZap, FiSave, FiFilePlus, FiX, FiTerminal, FiSidebar, FiMaximize, FiSearch, FiDownload } from 'react-icons/fi';

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'editor' | 'terminal' | 'file' | 'view' | 'run';
}

interface CommandPaletteProps {
  visible: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

export default function CommandPalette({ visible, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (visible) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [visible]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeCommand = useCallback((cmd: CommandItem) => {
    cmd.action();
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(p => Math.min(filtered.length - 1, p + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(p => Math.max(0, p - 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      executeCommand(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [filtered, selectedIndex, executeCommand, onClose]);

  if (!visible) return null;

  const categoryColors: Record<string, string> = {
    editor: '#7C3AED',
    terminal: '#10B981',
    file: '#3B82F6',
    view: '#F59E0B',
    run: '#EF4444',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-lg bg-[#13131A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
            <FiSearch size={16} className="text-[#888899] shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-[#E2E2EE] placeholder-[#555566] font-medium"
            />
            <kbd className="text-[10px] font-bold text-[#555566] bg-white/5 px-1.5 py-0.5 rounded border border-white/10">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-72 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-[#555566]">No commands found</div>
            ) : (
              filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                    i === selectedIndex ? 'bg-white/5' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <span style={{ color: categoryColors[cmd.category] || '#888899' }}>
                    {cmd.icon}
                  </span>
                  <span className="flex-1 text-sm font-medium text-[#E2E2EE]">{cmd.label}</span>
                  {cmd.shortcut && (
                    <kbd className="text-[10px] font-bold text-[#555566] bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                      {cmd.shortcut}
                    </kbd>
                  )}
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#444455]">
                    {cmd.category}
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 px-5 py-2.5 border-t border-white/10 text-[10px] text-[#555566]">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function buildCommands(handlers: {
  onRun: () => void;
  onSubmit: () => void;
  onSave: () => void;
  onNewFile: () => void;
  onCloseTab: () => void;
  onToggleTerminal: () => void;
  onToggleSidebar: () => void;
  onToggleSplit: () => void;
  onFullscreen: () => void;
  onExport: () => void;
}): CommandItem[] {
  return [
    { id: 'run', label: 'Run Code', shortcut: 'Ctrl+Enter', icon: <FiPlay size={14} />, action: handlers.onRun, category: 'run' },
    { id: 'submit', label: 'Submit Solution', shortcut: 'Ctrl+Shift+Enter', icon: <FiZap size={14} />, action: handlers.onSubmit, category: 'run' },
    { id: 'save', label: 'Save All Files', shortcut: 'Ctrl+S', icon: <FiSave size={14} />, action: handlers.onSave, category: 'editor' },
    { id: 'new-file', label: 'New File', shortcut: 'Ctrl+N', icon: <FiFilePlus size={14} />, action: handlers.onNewFile, category: 'file' },
    { id: 'close-tab', label: 'Close Tab', shortcut: 'Ctrl+W', icon: <FiX size={14} />, action: handlers.onCloseTab, category: 'file' },
    { id: 'toggle-terminal', label: 'Toggle Terminal', shortcut: 'Ctrl+`', icon: <FiTerminal size={14} />, action: handlers.onToggleTerminal, category: 'terminal' },
    { id: 'toggle-sidebar', label: 'Toggle Sidebar', shortcut: 'Ctrl+B', icon: <FiSidebar size={14} />, action: handlers.onToggleSidebar, category: 'view' },
    { id: 'toggle-split', label: 'Split Editor', shortcut: 'Ctrl+\\', icon: <FiCode size={14} />, action: handlers.onToggleSplit, category: 'view' },
    { id: 'fullscreen', label: 'Fullscreen Editor', shortcut: 'F11', icon: <FiMaximize size={14} />, action: handlers.onFullscreen, category: 'view' },
    { id: 'export', label: 'Export as ZIP', icon: <FiDownload size={14} />, action: handlers.onExport, category: 'file' },
  ];
}
