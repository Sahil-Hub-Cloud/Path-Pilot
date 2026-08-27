'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  fontSize?: number;
  tabSize?: number;
}

const LANG_COLORS: Record<string, string> = {
  python: '#3572A5',
  javascript: '#f1e05a',
  typescript: '#3178c6',
  jsx: '#61dafb',
  tsx: '#3178c6',
  html: '#e34c26',
  css: '#563d7c',
  json: '#292929',
  markdown: '#083fa1',
  bash: '#89e051',
  java: '#b07219',
  c: '#555555',
  cpp: '#f34b7d',
  go: '#00ADD8',
  rust: '#dea584',
};

function CodeEditor({
  value,
  onChange,
  language = 'python',
  height = '100%',
  readOnly = false,
  fontSize = 14,
  tabSize = 4,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    setLineCount((value || '').split('\n').length);
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const val = textarea.value;

        if (e.shiftKey) {
          // Outdent: remove tab/spaces from start of line
          const lineStart = val.lastIndexOf('\n', start - 1) + 1;
          const lineText = val.substring(lineStart, end);
          const dedented = lineText.replace(new RegExp(`^${' '.repeat(tabSize)}|\\t`), '');
          const diff = lineText.length - dedented.length;
          const newVal = val.substring(0, lineStart) + dedented + val.substring(end);
          onChange?.(newVal);
          requestAnimationFrame(() => {
            textarea.selectionStart = Math.max(start - diff, lineStart);
            textarea.selectionEnd = end - diff;
          });
        } else {
          // Indent
          const before = val.substring(0, start);
          const after = val.substring(end);
          const newVal = before + ' '.repeat(tabSize) + after;
          onChange?.(newVal);
          requestAnimationFrame(() => {
            textarea.selectionStart = textarea.selectionEnd = start + tabSize;
          });
        }
        return;
      }

      // Enter: auto-indent
      if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const start = textarea.selectionStart;
        const val = textarea.value;
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        const currentLine = val.substring(lineStart, start);
        const indent = currentLine.match(/^\s*/)?.[0] || '';
        // Add extra indent after colon (Python) or opening bracket
        const charBefore = val[start - 1];
        const extra = charBefore === ':' || charBefore === '{' || charBefore === '(' || charBefore === '[' ? ' '.repeat(tabSize) : '';
        const insertion = '\n' + indent + extra;
        const newVal = val.substring(0, start) + insertion + val.substring(textarea.selectionEnd);
        onChange?.(newVal);
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + insertion.length;
        });
        return;
      }

      // Ctrl+D: duplicate line
      if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const start = textarea.selectionStart;
        const val = textarea.value;
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        let lineEnd = val.indexOf('\n', start);
        if (lineEnd === -1) lineEnd = val.length;
        const line = val.substring(lineStart, lineEnd);
        const newVal = val.substring(0, lineEnd) + '\n' + line + val.substring(lineEnd);
        onChange?.(newVal);
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + line.length + 1;
        });
        return;
      }

      // Ctrl+/: toggle comment
      if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const start = textarea.selectionStart;
        const val = textarea.value;
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        let lineEnd = val.indexOf('\n', start);
        if (lineEnd === -1) lineEnd = val.length;
        const line = val.substring(lineStart, lineEnd);
        const commentPrefix = language === 'python' ? '# ' : '// ';
        let newLine: string;
        if (line.trimStart().startsWith(commentPrefix)) {
          newLine = line.replace(new RegExp(`^\\s*\\Q${commentPrefix}\\E`), '');
        } else if (line.trimStart().startsWith('#') || line.trimStart().startsWith('//')) {
          newLine = line.replace(/^(\s*)(#|\/\/)\s?/, '$1');
        } else {
          newLine = line.replace(/^(\s*)/, `$1${commentPrefix}`);
        }
        const newVal = val.substring(0, lineStart) + newLine + val.substring(lineEnd);
        onChange?.(newVal);
        return;
      }
    },
    [onChange, language, tabSize]
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-[#0D0D0F]" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace" }}>
      {/* Line numbers */}
      <div className="flex-shrink-0 select-none overflow-hidden py-4 pr-3 pl-4 text-right" style={{ fontSize: fontSize - 2, lineHeight: '1.6', color: '#333344', minWidth: 48 }}>
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1}>{i + 1}</div>
        ))}
      </div>

      {/* Code area */}
      <div className="relative flex-1 overflow-auto">
        {/* Syntax-highlighted overlay (read-only) */}
        <pre
          className="pointer-events-none absolute inset-0 m-0 p-4 whitespace-pre overflow-hidden"
          style={{ fontSize, lineHeight: '1.6', color: '#E2E2EE', tabSize }}
          aria-hidden="true"
        >
          {highlightCode(value, language)}
        </pre>

        {/* Editable textarea */}
        <textarea
          ref={textareaRef}
          className="absolute inset-0 m-0 w-full h-full resize-none bg-transparent outline-none p-4"
          style={{
            fontSize,
            lineHeight: '1.6',
            color: 'transparent',
            caretColor: '#7C3AED',
            tabSize,
            whiteSpace: 'pre',
            overflowWrap: 'normal',
            WebkitTextFillColor: 'transparent',
          }}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          data-gramm="false"
        />
      </div>

      {/* Language badge */}
      <div className="absolute top-2 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', fontSize: 11, color: LANG_COLORS[language] || '#888' }}>
        <span className="w-2 h-2 rounded-full" style={{ background: LANG_COLORS[language] || '#888' }} />
        {language.toUpperCase()}
      </div>
    </div>
  );
}

function highlightCode(code: string, language: string): React.ReactNode {
  if (!code) return <span>&nbsp;</span>;

  const lines = code.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <div key={i}>{highlightLine(line, language)}{'\n'}</div>
      ))}
    </>
  );
}

function highlightLine(line: string, language: string): React.ReactNode {
  if (!line) return null;

  // Tokenize the line
  const tokens: { text: string; type: string }[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    let matched = false;

    for (const rule of getLanguageRules(language)) {
      const match = remaining.match(rule.pattern);
      if (match && match.index === 0) {
        tokens.push({ text: match[0], type: rule.type });
        remaining = remaining.substring(match[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Find next match position
      let nextPos = remaining.length;
      for (const rule of getLanguageRules(language)) {
        const match = remaining.match(rule.pattern);
        if (match && match.index !== undefined && match.index < nextPos && match.index > 0) {
          nextPos = match.index;
        }
      }
      tokens.push({ text: remaining.substring(0, nextPos), type: 'plain' });
      remaining = remaining.substring(nextPos);
    }
  }

  return (
    <>
      {tokens.map((token, i) => {
        if (token.type === 'plain') return <span key={i}>{token.text}</span>;
        return (
          <span key={i} style={{ color: TOKEN_COLORS[token.type] || '#E2E2EE' }}>
            {token.text}
          </span>
        );
      })}
    </>
  );
}

function getLanguageRules(language: string) {
  switch (language) {
    case 'python':
      return [
        { pattern: /^#.*/, type: 'comment' },
        { pattern: /^"""[\s\S]*?"""|^'''[\s\S]*?'''/, type: 'string' },
        { pattern: /^"(?:[^"\\]|\\.)*"|^'(?:[^'\\]|\\.)*'/, type: 'string' },
        { pattern: /^f"(?:[^"\\]|\\.)*"|^f'(?:[^'\\]|\\.)*'/, type: 'string' },
        { pattern: /^\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|with|yield|lambda|pass|break|continue|and|or|not|in|is|True|False|None|async|await|raise|global|nonlocal|del|assert)\b/, type: 'keyword' },
        { pattern: /^\b(print|len|range|int|str|float|list|dict|set|tuple|type|input|open|super|enumerate|zip|map|filter|sorted|reversed|any|all|min|max|sum|abs|round)\b/, type: 'builtin' },
        { pattern: /^\b\d+\.?\d*\b/, type: 'number' },
        { pattern: /^\b[A-Z][A-Z_]+\b/, type: 'constant' },
        { pattern: /^\bself\b/, type: 'this' },
      ];
    case 'javascript':
    case 'typescript':
    case 'jsx':
    case 'tsx':
      return [
        { pattern: /^\/\/.*/, type: 'comment' },
        { pattern: /^\/\*[\s\S]*?\*\//, type: 'comment' },
        { pattern: /^"(?:[^"\\]|\\.)*"|^'(?:[^'\\]|\\.)*'|^`(?:[^`\\]|\\.)*`/, type: 'string' },
        { pattern: /^\b(const|let|var|function|class|if|else|for|while|do|return|import|from|export|default|async|await|try|catch|finally|throw|new|typeof|instanceof|in|of|this|null|undefined|true|false|switch|case|break|continue|yield|static|get|set|extends|super)\b/, type: 'keyword' },
        { pattern: /^\b(console|document|window|Math|JSON|Promise|Array|Object|String|Number|Boolean|RegExp|Date|Error|Map|Set)\b/, type: 'builtin' },
        { pattern: /^\b\d+\.?\d*\b/, type: 'number' },
        { pattern: /^\b[A-Z][a-zA-Z]+\b/, type: 'class' },
        { pattern: /^\b=>/, type: 'operator' },
      ];
    case 'html':
      return [
        { pattern: /^<!--[\s\S]*?-->/, type: 'comment' },
        { pattern: /^"(?:[^"\\]|\\.)*"|^'(?:[^'\\]|\\.)*'/, type: 'string' },
        { pattern: /^<\/?[a-zA-Z][\w-]*/, type: 'keyword' },
        { pattern: /^\b(class|id|style|src|href|alt|type|value|name|content|charset|rel|media)\b/, type: 'builtin' },
        { pattern: /^<\//, type: 'operator' },
        { pattern: /^\/?>/, type: 'operator' },
      ];
    case 'css':
      return [
        { pattern: /^\/\*[\s\S]*?\*\//, type: 'comment' },
        { pattern: /^"(?:[^"\\]|\\.)*"|^'(?:[^'\\]|\\.)*'/, type: 'string' },
        { pattern: /^#[0-9a-fA-F]{3,8}\b/, type: 'number' },
        { pattern: /^\b\d+\.?\d*(px|em|rem|%|vh|vw|s|ms)?\b/, type: 'number' },
        { pattern: /^\.[a-zA-Z_][\w-]*/, type: 'class' },
        { pattern: /^\b(color|background|margin|padding|border|font|display|position|width|height|top|left|right|bottom|flex|grid|transition|transform|animation)\b/, type: 'builtin' },
      ];
    case 'json':
      return [
        { pattern: /^"(?:[^"\\]|\\.)*"/, type: 'string' },
        { pattern: /^\b(true|false|null)\b/, type: 'keyword' },
        { pattern: /^-?\b\d+\.?\d*([eE][+-]?\d+)?\b/, type: 'number' },
      ];
    case 'bash':
    case 'shell':
      return [
        { pattern: /^#.*/, type: 'comment' },
        { pattern: /^"(?:[^"\\]|\\.)*"|^'[^']*'/, type: 'string' },
        { pattern: /^\b(if|then|else|elif|fi|for|do|done|while|until|case|esac|function|return|exit|echo|cd|ls|mkdir|rm|cp|mv|cat|grep|sed|awk|chmod|chown|sudo|apt|npm|pip|git|docker)\b/, type: 'keyword' },
        { pattern: /^\$\{?[\w]+\}?/, type: 'variable' },
        { pattern: /^\b\d+\b/, type: 'number' },
      ];
    case 'java':
      return [
        { pattern: /^\/\/.*/, type: 'comment' },
        { pattern: /^\/\*[\s\S]*?\*\//, type: 'comment' },
        { pattern: /^"(?:[^"\\]|\\.)*"/, type: 'string' },
        { pattern: /^\b(public|private|protected|class|interface|extends|implements|if|else|for|while|do|return|import|package|new|this|super|null|true|false|void|int|long|double|float|boolean|char|String|static|final|abstract|synchronized|try|catch|finally|throw|throws|instanceof|switch|case|break|continue|enum|record|sealed|permits|var)\b/, type: 'keyword' },
        { pattern: /^\b(System|Math|Integer|Double|Boolean|String|Object|ArrayList|HashMap|List|Map|Set|Collections|Arrays|Stream|Optional)\b/, type: 'builtin' },
        { pattern: /^\b\d+[Ll]?\b/, type: 'number' },
        { pattern: /^\b[A-Z][a-zA-Z]+\b/, type: 'class' },
      ];
    case 'go':
      return [
        { pattern: /^\/\/.*/, type: 'comment' },
        { pattern: /^\/\*[\s\S]*?\*\//, type: 'comment' },
        { pattern: /^"(?:[^"\\]|\\.)*"|^`[^`]*`/, type: 'string' },
        { pattern: /^\b(package|import|func|return|if|else|for|range|switch|case|default|var|const|type|struct|interface|map|chan|go|defer|select|case|break|continue|nil|true|false|make|new|len|cap|append|copy|delete|print|println|error|string|int|int8|int16|int32|int64|float32|float64|bool|byte|rune|uint|uintptr)\b/, type: 'keyword' },
        { pattern: /^\b(fmt|log|os|io|net|http|json|strings|strconv|sort|sync|time|context)\b/, type: 'builtin' },
        { pattern: /^\b\d+\.?\d*\b/, type: 'number' },
      ];
    case 'rust':
      return [
        { pattern: /^\/\/.*/, type: 'comment' },
        { pattern: /^\/\*[\s\S]*?\*\//, type: 'comment' },
        { pattern: /^"(?:[^"\\]|\\.)*"/, type: 'string' },
        { pattern: /^\b(fn|let|mut|pub|struct|enum|impl|trait|use|mod|crate|self|super|return|if|else|for|while|loop|break|continue|match|as|in|ref|move|async|await|dyn|where|type|const|static|unsafe|extern)\b/, type: 'keyword' },
        { pattern: /^\b(String|Vec|Option|Result|Box|Rc|Arc|Cell|RefCell|Mutex|HashMap|HashSet|Iterator|Display|Debug|Clone|Copy|Default|From|Into|ToString|str|i8|i16|i32|i64|i128|u8|u16|u32|u64|u128|f32|f64|bool|char|usize|isize)\b/, type: 'builtin' },
        { pattern: /^\b\d+\.?\d*\b/, type: 'number' },
        { pattern: /^'[a-z_]\w*/, type: 'type' },
      ];
    default:
      return [
        { pattern: /^#.*/, type: 'comment' },
        { pattern: /^\/\/.*/, type: 'comment' },
        { pattern: /^"(?:[^"\\]|\\.)*"|^'[^']*'/, type: 'string' },
        { pattern: /^\b\d+\.?\d*\b/, type: 'number' },
      ];
  }
}

const TOKEN_COLORS: Record<string, string> = {
  keyword: '#C678DD',
  string: '#98C379',
  comment: '#5C6370',
  number: '#D19A66',
  builtin: '#61AFEF',
  operator: '#56B6C2',
  class: '#E5C07B',
  this: '#E06C75',
  constant: '#D19A66',
  variable: '#E06C75',
  type: '#E5C07B',
  plain: '#E2E2EE',
};

export default React.memo(CodeEditor);
