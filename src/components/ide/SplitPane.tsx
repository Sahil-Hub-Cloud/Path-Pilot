'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSplit?: number;
  minLeft?: number;
  maxLeft?: number;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export default function SplitPane({
  left,
  right,
  defaultSplit = 50,
  minLeft = 20,
  maxLeft = 80,
  direction = 'horizontal',
  className = '',
}: SplitPaneProps) {
  const [splitPercent, setSplitPercent] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      let percent: number;
      if (direction === 'horizontal') {
        percent = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        percent = ((e.clientY - rect.top) / rect.height) * 100;
      }

      setSplitPercent(Math.max(minLeft, Math.min(maxLeft, percent)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, direction, minLeft, maxLeft]);

  const isHorizontal = direction === 'horizontal';

  return (
    <div
      ref={containerRef}
      className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} ${className}`}
      style={{ cursor: isDragging ? (isHorizontal ? 'col-resize' : 'row-resize') : undefined }}
    >
      <div style={isHorizontal ? { width: `${splitPercent}%` } : { height: `${splitPercent}%` }} className="overflow-hidden">
        {left}
      </div>

      <div
        onMouseDown={handleMouseDown}
        className={`flex-shrink-0 group z-10 ${
          isHorizontal ? 'w-1.5 cursor-col-resize' : 'h-1.5 cursor-row-resize'
        } bg-white/5 hover:bg-[#7C3AED]/30 transition-colors relative`}
      >
        <div
          className={`absolute ${
            isHorizontal ? 'top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0.5 h-8' : 'left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-0.5 w-8'
          } rounded-full bg-[#555566] group-hover:bg-[#7C3AED] transition-colors`}
        />
      </div>

      <div style={isHorizontal ? { width: `${100 - splitPercent}%` } : { height: `${100 - splitPercent}%` }} className="overflow-hidden">
        {right}
      </div>
    </div>
  );
}
