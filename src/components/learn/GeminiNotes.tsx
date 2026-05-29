'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function GeminiNotes({ markdown }: { markdown: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: 'rgba(13,140,122,0.12)',
          border: '1px solid rgba(13,140,122,0.25)',
          borderRadius: 8,
          fontSize: 9,
          fontWeight: 800,
          color: '#0D8C7A',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          width: 'fit-content',
        }}
      >
        ✨ AI Generated · Gemini
      </div>
      <div
        className="learn-notes-markdown"
        style={{
          fontSize: 14,
          color: '#5C3D1E',
          lineHeight: 1.75,
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => (
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 900,
                  color: '#2C1A0E',
                  margin: '16px 0 8px',
                  letterSpacing: '-0.02em',
                }}
              >
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0D8C7A', margin: '12px 0 6px' }}>
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p style={{ margin: '0 0 10px', lineHeight: 1.75 }}>{children}</p>
            ),
            ul: ({ children }) => (
              <ul style={{ margin: '0 0 12px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol style={{ margin: '0 0 12px', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {children}
              </ol>
            ),
            li: ({ children }) => <li style={{ lineHeight: 1.65 }}>{children}</li>,
            strong: ({ children }) => <strong style={{ color: '#2C1A0E', fontWeight: 800 }}>{children}</strong>,
            code: ({ children }) => (
              <code
                style={{
                  background: 'rgba(13,140,122,0.08)',
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontFamily: 'ui-monospace, monospace',
                }}
              >
                {children}
              </code>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
