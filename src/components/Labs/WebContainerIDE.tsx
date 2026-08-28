'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { WebContainer } from '@webcontainer/api';
const CodeEditor = dynamic(() => import('@/components/ide/CodeEditor'), { ssr: false, loading: () => null });
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  FiPlay, FiDownload, FiFolder, FiFile, FiTerminal, 
  FiRefreshCw, FiSave, FiAlertCircle
} from 'react-icons/fi';

interface FileNode {
  type: 'file' | 'directory';
  name: string;
  content?: string;
  children?: FileNode[];
}

interface WebContainerIDEProps {
  labId: string;
  initialFiles?: Record<string, any>;
}

export default function WebContainerIDE({ labId, initialFiles }: WebContainerIDEProps) {
  const { user } = useAuth();
  const [wc, setWc] = useState<WebContainer | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [activeFile, setActiveFile] = useState<string>('index.js');
  const [fileSystem, setFileSystem] = useState<Record<string, any>>({});
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [isBooting, setIsBooting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Default files if none loaded from firestore
  const defaultFiles = {
    'package.json': {
      file: {
        contents: `
{
  "name": "lab-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
        `.trim(),
      },
    },
    'index.js': {
      file: {
        contents: `
const express = require('express');
const app = express();
const port = 3111;

app.get('/', (req, res) => {
  res.send('Hello from WebContainer!');
});

app.listen(port, () => {
  console.log(\`App listening at http://localhost:\${port}\`);
});
        `.trim(),
      },
    },
  };

  // 1. Fetch files from Firestore
  useEffect(() => {
    async function loadFiles() {
      if (!user?.uid || !db) return;
      try {
        const docRef = doc(db, 'users', user.uid, 'projects', labId);
        const snap = await getDoc(docRef);
        if (snap.exists() && snap.data().files) {
          const loaded = snap.data().files;
          setFileSystem(loaded);
          
          // flatten for editor state
          const contents: Record<string, string> = {};
          for (const key of Object.keys(loaded)) {
            if ((loaded as Record<string, any>)[key]?.file?.contents) {
              contents[key] = (loaded as Record<string, any>)[key].file.contents;
            }
          }
          setFileContents(contents);
          if (Object.keys(contents).length > 0) {
            setActiveFile(Object.keys(contents)[0]);
          }
        } else {
          // Use default files
          const filesToUse = initialFiles || defaultFiles;
          setFileSystem(filesToUse);
          const contents: Record<string, string> = {};
          for (const key of Object.keys(filesToUse)) {
            if ((filesToUse as Record<string, any>)[key]?.file?.contents) {
              contents[key] = (filesToUse as Record<string, any>)[key].file.contents;
            }
          }
          setFileContents(contents);
          if (Object.keys(contents).length > 0) {
            setActiveFile(Object.keys(contents)[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load files:', err);
        setError('Failed to load project files.');
      }
    }
    if (user?.uid) {
      loadFiles();
    } else {
      // Setup default for guest
      setFileSystem(defaultFiles);
      setFileContents({
        'package.json': defaultFiles['package.json'].file.contents,
        'index.js': defaultFiles['index.js'].file.contents,
      });
    }
  }, [user, labId]);

  // 2. Boot WebContainer
  useEffect(() => {
    let isMounted = true;
    let webcontainerInstance: WebContainer;

    async function boot() {
      try {
        setIsBooting(true);
        // Ensure headers are correct for SharedArrayBuffer
        if (!window.crossOriginIsolated) {
          setError('Cross-Origin Isolation is not enabled. WebContainers require COOP/COEP headers.');
          return;
        }

        webcontainerInstance = await WebContainer.boot();
        if (!isMounted) return;
        
        setWc(webcontainerInstance);

        webcontainerInstance.on('server-ready', (port, url) => {
          setIframeUrl(url);
        });

      } catch (err: any) {
        if (err.message?.includes('Cross-Origin')) {
           setError('WebContainer requires cross-origin isolation headers.');
        } else {
           setError('Failed to boot WebContainer: ' + err.message);
        }
      } finally {
        if (isMounted) setIsBooting(false);
      }
    }
    
    // Only boot if not already booted
    if (!wc) boot();

    return () => {
      isMounted = false;
      // Webcontainer teardown is tricky and usually handled by page reload
      // webcontainerInstance?.teardown();
    };
  }, []);

  // 3. Mount files to WebContainer once booted and fileSystem is loaded
  useEffect(() => {
    if (wc && Object.keys(fileSystem).length > 0) {
      wc.mount(fileSystem).catch(err => {
        console.error('Error mounting files:', err);
      });
    }
  }, [wc, fileSystem]);

  // 4. Setup Terminal
  useEffect(() => {
    if (!terminalRef.current || terminalInstance.current) return;

    const term = new Terminal({
      theme: {
        background: '#13131A',
        foreground: '#E2E2EE',
      },
      fontFamily: 'monospace',
      fontSize: 13,
      convertEol: true,
    });
    
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(terminalRef.current);
    fit.fit();
    
    terminalInstance.current = term;
    fitAddon.current = fit;

    const handleResize = () => fit.fit();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, []);

  // Bind WebContainer process to Terminal
  const startShell = useCallback(async () => {
    if (!wc || !terminalInstance.current) return;
    
    try {
      const shellProcess = await wc.spawn('jsh', {
        terminal: {
          cols: terminalInstance.current.cols,
          rows: terminalInstance.current.rows,
        },
      });

      shellProcess.output.pipeTo(new WritableStream({
        write(data) {
          terminalInstance.current?.write(data);
        }
      }));

      const input = shellProcess.input.getWriter();
      terminalInstance.current.onData((data) => {
        input.write(data);
      });
      
    } catch (err) {
      console.error('Shell spawn error:', err);
      terminalInstance.current.write('\\r\\nError starting shell\\r\\n');
    }
  }, [wc]);

  useEffect(() => {
    if (wc && terminalInstance.current) {
      startShell();
    }
  }, [wc, startShell]);

  // Auto-save function
  const autoSaveToFirestore = async (newContents: Record<string, string>) => {
    if (!user?.uid || !db) return;
    
    try {
      setSaveStatus('Saving...');
      // Rebuild file tree format for webcontainer & firestore
      const newFs: Record<string, any> = {};
      for (const [name, content] of Object.entries(newContents)) {
        newFs[name] = { file: { contents: content } };
      }
      
      const docRef = doc(db, 'users', user.uid, 'projects', labId);
      await setDoc(docRef, {
        files: newFs,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      // Update WebContainer files
      if (wc) {
        for (const [name, content] of Object.entries(newContents)) {
          await wc.fs.writeFile(name, content);
        }
      }
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      console.error('Auto-save failed:', err);
      setSaveStatus('Save Failed');
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value === undefined) return;
    
    const newContents = { ...fileContents, [activeFile]: value };
    setFileContents(newContents);

    // Debounce save
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      autoSaveToFirestore(newContents);
    }, 1500);
  };

  const handleExportZip = async () => {
    const zip = new JSZip();
    for (const [name, content] of Object.entries(fileContents)) {
      zip.file(name, content);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${labId}-project.zip`);
  };

  const runInstall = async () => {
    if (!wc || !terminalInstance.current) return;
    const process = await wc.spawn('npm', ['install']);
    process.output.pipeTo(new WritableStream({
      write(data) { terminalInstance.current?.write(data); }
    }));
  };

  const runStart = async () => {
    if (!wc || !terminalInstance.current) return;
    const process = await wc.spawn('npm', ['start']);
    process.output.pipeTo(new WritableStream({
      write(data) { terminalInstance.current?.write(data); }
    }));
  };

  // Get language for Monaco based on file extension
  const getLanguage = (filename: string) => {
    if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript';
    if (filename.endsWith('.json')) return 'json';
    if (filename.endsWith('.html')) return 'html';
    if (filename.endsWith('.css')) return 'css';
    return 'javascript';
  };

  return (
    <div className="flex flex-col h-screen bg-[#0D0D0F] text-[#E2E2EE] font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#13131A] border-b border-white/10">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-bold truncate max-w-xs">{labId} IDE</h1>
          {saveStatus && <span className="text-xs text-gray-400">{saveStatus}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={runInstall}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
          >
            <FiRefreshCw size={12} /> npm install
          </button>
          <button 
            onClick={runStart}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg"
          >
            <FiPlay size={12} /> npm start
          </button>
          <button 
            onClick={handleExportZip}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
          >
            <FiDownload size={12} /> Export
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-[#13131A] border-r border-white/10 flex flex-col">
          <div className="p-3 text-xs font-black tracking-widest text-[#444455] uppercase">
            Explorer
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {Object.keys(fileContents).map(filename => (
              <button
                key={filename}
                onClick={() => setActiveFile(filename)}
                className={`flex items-center gap-2 w-full px-2 py-1.5 text-left text-sm rounded-md transition-colors ${activeFile === filename ? 'bg-[#7C3AED]/20 text-[#A78BFA]' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <FiFile size={14} />
                {filename}
              </button>
            ))}
          </div>
        </aside>

        {/* Center: Editor + Terminal */}
        <div className="flex flex-col flex-1 min-w-0">
          
          {/* Editor */}
          <div className="flex-1 relative bg-[#1A1A24]">
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-red-400 bg-red-900/10">
                <div className="flex flex-col items-center gap-4">
                  <FiAlertCircle size={32} />
                  <p className="font-semibold max-w-md">{error}</p>
                </div>
              </div>
            ) : isBooting ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin w-8 h-8 border-2 border-t-transparent border-[#7C3AED] rounded-full"></div>
                  <p className="text-sm font-medium text-gray-400">Booting WebContainer...</p>
                </div>
              </div>
            ) : (
              <CodeEditor
                height="100%"
                language={getLanguage(activeFile)}
                value={fileContents[activeFile] || ''}
                onChange={handleEditorChange}
                fontSize={14}
              />
            )}
          </div>

          {/* Terminal */}
          <div className="h-64 border-t border-white/10 bg-[#13131A] flex flex-col">
            <div className="flex items-center px-4 py-2 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-widest gap-2">
              <FiTerminal size={14} /> Terminal
            </div>
            <div className="flex-1 relative p-2" ref={terminalRef}>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <aside className="w-80 border-l border-white/10 bg-white hidden xl:flex flex-col">
          <div className="flex items-center px-4 py-2 border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-600 uppercase tracking-widest">
            Preview
          </div>
          <div className="flex-1 relative bg-white">
            {iframeUrl ? (
              <iframe
                src={iframeUrl}
                className="absolute inset-0 w-full h-full border-none"
                title="Preview"
                sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Run npm start to see preview
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
