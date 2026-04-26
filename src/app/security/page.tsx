'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SecuritySentinelPage() {
    const router = useRouter();
    const [scanning, setScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [codeInput, setCodeInput] = useState('');
    const [issues, setIssues] = useState<{ line: number; issue: string; severity: 'high' | 'medium' | 'low'; type: string }[]>([]);
    const [score, setScore] = useState(0);

    const handleScan = () => {
        if (!codeInput.trim()) return;
        setScanning(true);
        setScanComplete(false);
        setIssues([]);

        // Real heuristic scan of the pasted code
        setTimeout(() => {
            const foundIssues: typeof issues = [];
            const lines = codeInput.split('\n');

            lines.forEach((line, i) => {
                const lineNum = i + 1;
                const lower = line.toLowerCase();

                if (/eval\s*\(/.test(line))
                    foundIssues.push({ line: lineNum, issue: 'Usage of eval() — potential code injection risk', severity: 'high', type: 'Code Injection' });
                if (/api[_-]?key|secret[_-]?key|password\s*=\s*['"]/.test(lower))
                    foundIssues.push({ line: lineNum, issue: 'Hardcoded secret or API key detected', severity: 'high', type: 'Secret Leak' });
                if (/console\.(log|warn|error)/.test(line))
                    foundIssues.push({ line: lineNum, issue: 'Console statement left in code', severity: 'low', type: 'Info Leak' });
                if (/innerHTML\s*=/.test(line))
                    foundIssues.push({ line: lineNum, issue: 'Direct innerHTML assignment — XSS risk', severity: 'high', type: 'XSS' });
                if (/http:\/\//.test(line) && !/localhost/.test(line))
                    foundIssues.push({ line: lineNum, issue: 'HTTP used instead of HTTPS', severity: 'medium', type: 'Insecure Transport' });
                if (/md5|sha1\b/i.test(line))
                    foundIssues.push({ line: lineNum, issue: 'Weak hashing algorithm detected', severity: 'medium', type: 'Weak Crypto' });
                if (/\$\{.*\}/.test(line) && /query|sql/i.test(line))
                    foundIssues.push({ line: lineNum, issue: 'Potential SQL injection via string interpolation', severity: 'high', type: 'SQL Injection' });
            });

            setIssues(foundIssues);
            const highCount = foundIssues.filter(i => i.severity === 'high').length;
            const medCount = foundIssues.filter(i => i.severity === 'medium').length;
            const lowCount = foundIssues.filter(i => i.severity === 'low').length;
            const penalty = highCount * 15 + medCount * 8 + lowCount * 3;
            setScore(Math.max(0, 100 - penalty));
            setScanning(false);
            setScanComplete(true);
        }, 2500);
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
            <nav className="skeu-navbar px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.push('/dashboard')} className="clay-btn clay-btn-secondary clay-btn-sm">← Dashboard</button>
                        <div className="h-4 w-px" style={{ background: 'var(--border-medium)' }} />
                        <span className="font-bold text-sm">🔒 Security Sentinel</span>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* Input area */}
                {!scanComplete && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-2xl font-black mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                            Scan Your Code
                        </h1>
                        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                            Paste your code below and we&apos;ll analyze it for security vulnerabilities.
                        </p>
                        <div className="skeu-card p-1 mb-4">
                            <textarea value={codeInput} onChange={e => setCodeInput(e.target.value)}
                                placeholder="Paste your code here..."
                                className="w-full min-h-[250px] p-5 rounded-xl text-sm font-mono resize-y focus:outline-none"
                                style={{ background: 'var(--bg-inset)', color: 'var(--text-primary)', border: 'none' }}
                            />
                        </div>
                        <button onClick={handleScan} disabled={!codeInput.trim() || scanning}
                            className="clay-btn clay-btn-primary clay-btn-lg">
                            {scanning ? '⏳ Scanning...' : '🔒 Run Security Scan'}
                        </button>
                    </motion.div>
                )}

                {/* Scanning animation */}
                {scanning && (
                    <div className="skeu-card-teal p-10 text-center mb-8 relative overflow-hidden">
                        <div className="scan-line" />
                        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>
                            Scanning Code...
                        </p>
                        <div className="w-10 h-10 border-3 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--bg-inset)', borderTopColor: 'var(--accent-primary)' }} />
                        <p className="text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>Analyzing for vulnerabilities...</p>
                    </div>
                )}

                {/* Results */}
                {scanComplete && (
                    <>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="skeu-card-teal p-10 text-center mb-8">
                            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-tertiary)' }}>Scan Complete</p>
                            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                <p className="font-black text-7xl mb-2" style={{ fontFamily: 'var(--font-display)', color: score >= 80 ? '#10b981' : score >= 60 ? '#F59E0B' : '#ef4444' }}>
                                    {score}<span className="text-2xl" style={{ color: 'var(--text-tertiary)' }}>/100</span>
                                </p>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {score >= 90 ? 'Excellent — very secure code!' : score >= 70 ? 'Good — a few issues to address' : score >= 50 ? 'Fair — several vulnerabilities found' : 'Needs attention — critical issues detected'}
                                </p>
                            </motion.div>
                            {issues.length > 0 && (
                                <div className="flex items-center justify-center gap-4 mt-6">
                                    {issues.filter(i => i.severity === 'high').length > 0 && <span className="badge-high">{issues.filter(i => i.severity === 'high').length} High</span>}
                                    {issues.filter(i => i.severity === 'medium').length > 0 && <span className="badge-medium">{issues.filter(i => i.severity === 'medium').length} Medium</span>}
                                    {issues.filter(i => i.severity === 'low').length > 0 && <span className="badge-low">{issues.filter(i => i.severity === 'low').length} Low</span>}
                                </div>
                            )}
                        </motion.div>

                        {issues.length > 0 ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="skeu-card overflow-hidden mb-8">
                                <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Issues Found</h3>
                                </div>
                                <table className="data-table">
                                    <thead><tr><th>Line</th><th>Type</th><th>Description</th><th>Severity</th></tr></thead>
                                    <tbody>
                                        {issues.map((issue, i) => (
                                            <motion.tr key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                                                <td className="font-mono font-bold">#{issue.line}</td>
                                                <td className="font-semibold text-sm">{issue.type}</td>
                                                <td>{issue.issue}</td>
                                                <td><span className={`badge-${issue.severity}`}>{issue.severity}</span></td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="skeu-card p-10 text-center mb-8">
                                <span className="text-4xl block mb-3">🎉</span>
                                <h3 className="font-bold text-lg mb-2">No issues found!</h3>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Your code looks clean and secure.</p>
                            </motion.div>
                        )}

                        <button onClick={() => { setScanComplete(false); setCodeInput(''); setIssues([]); }}
                            className="clay-btn clay-btn-secondary">
                            🔄 Scan New Code
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
