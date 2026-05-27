'use client';

export function GeminiNotes({ markdown }: { markdown: string }) {
  const lines = markdown.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
          marginBottom: 4,
          width: 'fit-content',
        }}
      >
        ✨ AI Generated · Gemini
      </div>
      {lines.map((line, i) => {
        const t = line.trim();
        if (!t) return <div key={i} style={{ height: 4 }} />;
        if (t.startsWith('## '))
          return (
            <h2 key={i} style={{ fontSize: 17, fontWeight: 900, color: '#2C1A0E', margin: '12px 0 2px' }}>
              {t.slice(3)}
            </h2>
          );
        if (t.startsWith('### '))
          return (
            <h3 key={i} style={{ fontSize: 13, fontWeight: 800, color: '#0D8C7A', margin: '8px 0 2px' }}>
              {t.slice(4)}
            </h3>
          );
        if (t.startsWith('- ') || t.startsWith('* ')) {
          const content = t.slice(2).replace(/\*\*(.*?)\*\*/g, '$1');
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: 13,
                color: '#5C3D1E',
                lineHeight: 1.65,
                paddingLeft: 8,
              }}
            >
              <span style={{ color: '#0D8C7A', fontWeight: 900, flexShrink: 0 }}>▸</span>
              <span>{content}</span>
            </div>
          );
        }
        if (/^\d+\.\s/.test(t)) {
          const [num, ...rest] = t.split('. ');
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 10,
                fontSize: 13,
                color: '#5C3D1E',
                lineHeight: 1.65,
                paddingLeft: 8,
              }}
            >
              <span style={{ color: '#0D8C7A', fontWeight: 900, minWidth: 18 }}>{num}.</span>
              <span>{rest.join('. ').replace(/\*\*(.*?)\*\*/g, '$1')}</span>
            </div>
          );
        }
        return (
          <p key={i} style={{ fontSize: 14, color: '#5C3D1E', lineHeight: 1.75, margin: 0 }}>
            {t.replace(/\*\*(.*?)\*\*/g, '$1')}
          </p>
        );
      })}
    </div>
  );
}
