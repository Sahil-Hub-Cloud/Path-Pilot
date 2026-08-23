'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface TerminalSearchProps {
  visible: boolean;
  onClose: () => void;
  terminalRef: React.RefObject<{ buffer: { active: { interpreter: { getSelection(): string; selectAll(): void } } } | null>;
}

export default function TerminalSearch({ visible, onClose, terminalRef }: TerminalSearchProps) {
  const [query, setQuery] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  const handleSearch = useCallback(() => {
    if (!query || !terminalRef.current) {
      setMatchCount(0);
      return;
    }
    try {
      const term = terminalRef.current as unknown as { buffer: { active: { lines: string[] } } };
      const lines = term.buffer?.active?.lines || [];
      let count = 0;
      for (const line of lines) {
        if (String(line).toLowerCase().includes(query.toLowerCase())) {
          count++;
        }
      }
      setMatchCount(count);
      setCurrentMatch(count > 0 ? 1 : 0);
    } catch {
      setMatchCount(0);
    }
  }, [query, terminalRef]);

  useEffect(() => {
    handleSearch();
  }, [query, handleSearch]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="absolute top-0 right-0 z-50 flex items-center gap-2 p-2 bg-[#1A1A24] border border-white/10 rounded-bl-lg shadow-xl"
      >
        <FiSearch size={12} className="text-[#888899]" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (e.shiftKey) setCurrentMatch(p => Math.max(1, p - 1));
              else setCurrentMatch(p => Math.min(matchCount, p + 1));
            }
            if (e.key === 'Escape') onClose();
          }}
          placeholder="Search terminal..."
          className="w-40 text-xs bg-transparent border-none outline-none text-[#E2E2EE] placeholder-[#555566]"
        />
        {matchCount > 0 && (
          <span className="text-[10px] text-[#888899]">{currentMatch}/{matchCount}</span>
        )}
        <button onClick={() => setCurrentMatch(p => Math.max(1, p - 1))} className="p-1 hover:bg-white/5 rounded">
          <FiArrowUp size={10} className="text-[#888899]" />
        </button>
        <button onClick={() => setCurrentMatch(p => Math.min(matchCount, p + 1))} className="p-1 hover:bg-white/5 rounded">
          <FiArrowDown size={10} className="text-[#888899]" />
        </button>
        <button onClick={onClose} className="p-1 hover:bg-white/5 rounded">
          <FiX size={10} className="text-[#888899]" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
