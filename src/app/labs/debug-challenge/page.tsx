'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Editor, { loader } from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomChallenge, BrokenCodeChallenge } from '@/lib/data/broken-code-challenges';
import { calculateDebuggingDelta } from '@/lib/scoring-engine';
import { SkillMetricsService } from '@/lib/services/skill-metrics';

// Configure Monaco loader
if (typeof window !== 'undefined') {
    loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs' } });
}

export default function DebugChallengePage() {
    const router = useRouter();
    const [challenge, setChallenge] = useState<BrokenCodeChallenge | null>(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState<string[]>(['[SYSTEM] Debug Challenge Initialized...']);
    const [isRunning, setIsRunning] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [solved, setSolved] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);
    const [difficultyFilter, setDifficultyFilter] = useState<'Easy' | 'Medium' | 'Hard' | undefined>(undefined);
    const [languageFilter, setLanguageFilter] = useState<'javascript' | 'python' | undefined>(undefined);
    const [challengeCount, setChallengeCount] = useState(0);

    const loadChallenge = () => {
        const c = getRandomChallenge({ difficulty: difficultyFilter, language: languageFilter });
        setChallenge(c);
        setCode(c.brokenCode);
        setOutput(['[SYSTEM] New Debug Challenge Loaded.', `[MISSION] ${c.description}`, `[BUG TYPE] ${c.bugType} | Difficulty: ${c.difficulty}`]);
        setShowHint(false);
        setHintsUsed(0);
        setSolved(false);
        setStartTime(Date.now());
        setTimeTaken(0);
    };

    useEffect(() => {
        loadChallenge();
    }, [difficultyFilter, languageFilter]);

    const runCode = async () => {
        if (!challenge) return;
        setIsRunning(true);
        setOutput(prev => [...prev, `[INIT] Running ${challenge.language} debug test...`]);

        try {
            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: challenge.language,
                    version: '*',
                    files: [{ content: code }]
                })
            });

            const data = await response.json();
            const stderr = data.run.stderr || '';
            const stdout = data.run.stdout || '';

            if (stderr) {
                setOutput(prev => [...prev, `[ERROR] ${stderr}`]);
            }

            if (stdout) {
                const lines = stdout.split('\n').filter((l: string) => l.trim() !== '');
                setOutput(prev => [...prev, ...lines.map((l: string) => `[STDOUT] ${l}`)]);
            }

            // Check if the fix matches expected output
            const outputClean = stdout.trim().split('\n')[0]?.trim() || '';
            if (outputClean.includes(challenge.expectedOutput) && !stderr) {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                setTimeTaken(elapsed);
                setSolved(true);
                setChallengeCount(prev => prev + 1);

                const debugDelta = calculateDebuggingDelta(true, hintsUsed, elapsed);
                const userId = localStorage.getItem('pathpilot_user_id') || 'guest';
                await SkillMetricsService.updateMetrics(userId, challenge.language, {
                    debuggingDelta: debugDelta,
                    solvedDebugChallenge: true,
                });

                setOutput(prev => [
                    ...prev,
                    `[SUCCESS] Bug squashed! Debug score: +${debugDelta.toFixed(3)}`,
                    `[STATS] Time: ${elapsed}s | Hints: ${hintsUsed} | Challenges: ${challengeCount + 1}`
                ]);
            } else if (!stderr) {
                setOutput(prev => [...prev, '[PARTIAL] Code runs but output doesn\'t match expected. Keep debugging!']);
            }
        } catch (error) {
            setOutput(prev => [...prev, '[CRITICAL] Execution engine offline. Check network.']);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="h-screen bg-[#020617] text-white flex flex-col font-mono overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-white/5 bg-[#050911]/80 backdrop-blur-xl px-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button onClick={() => router.back()} className="text-white/30 hover:text-white transition-all text-sm">EXIT_DEBUG</button>
                    <div className="w-[1px] h-4 bg-white dark:bg-gray-800/10" />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xs font-black">🐛</div>
                        <div>
                            <h1 className="text-[10px] font-black uppercase tracking-[0.3em]">Debug Challenge</h1>
                            <p className="text-[8px] text-white/30 uppercase tracking-widest mt-0.5">
                                {challenge?.title || 'Loading...'} — {challenge?.difficulty}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Filters */}
                    <select
                        value={difficultyFilter || ''}
                        onChange={(e) => setDifficultyFilter(e.target.value as any || undefined)}
                        className="bg-white dark:bg-gray-800/5 border border-white/10 rounded-lg px-3 py-1.5 text-[9px] uppercase tracking-widest text-white/60"
                    >
                        <option value="">All Levels</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    <select
                        value={languageFilter || ''}
                        onChange={(e) => setLanguageFilter(e.target.value as any || undefined)}
                        className="bg-white dark:bg-gray-800/5 border border-white/10 rounded-lg px-3 py-1.5 text-[9px] uppercase tracking-widest text-white/60"
                    >
                        <option value="">All Languages</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                    </select>

                    <button
                        onClick={runCode}
                        disabled={isRunning}
                        className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isRunning ? 'bg-white dark:bg-gray-800/5 text-white/20' : 'bg-red-500 text-white hover:bg-red-400'}`}
                    >
                        {isRunning ? 'TESTING...' : 'TEST_FIX'}
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Mission Briefing */}
                <div className="w-[350px] border-r border-white/5 flex flex-col bg-black/40">
                    <div className="h-10 bg-black/20 border-b border-white/5 flex items-center px-6">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Mission Briefing</span>
                    </div>

                    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                        {/* Bug Description */}
                        <div>
                            <h3 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3">Bug Report</h3>
                            <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl">
                                <p className="text-[10px] text-white/70 leading-relaxed">{challenge?.description}</p>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-red-500/20 rounded text-[8px] font-black text-red-300 uppercase">{challenge?.bugType}</span>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${challenge?.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                                        challenge?.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                            'bg-red-500/20 text-red-300'
                                        }`}>{challenge?.difficulty}</span>
                                </div>
                            </div>
                        </div>

                        {/* Hint */}
                        <div>
                            <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3">Intel (Hint)</h3>
                            <button
                                onClick={() => { if (!showHint) { setShowHint(true); setHintsUsed(prev => prev + 1); } }}
                                className={`w-full text-left bg-purple-500/5 border border-purple-500/20 p-4 rounded-2xl transition-all ${showHint ? '' : 'hover:bg-purple-500/10 cursor-pointer'}`}
                            >
                                {showHint ? (
                                    <p className="text-[10px] text-white/60 leading-relaxed italic">{challenge?.hint}</p>
                                ) : (
                                    <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">
                                        🔒 Reveal Hint (−Debug Score)
                                    </p>
                                )}
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="pt-4 border-t border-white/5">
                            <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-3">Session Stats</h3>
                            <div className="space-y-2 text-[9px]">
                                <div className="flex justify-between">
                                    <span className="text-white/40">Challenges Solved</span>
                                    <span className="text-cyan-400 font-black">{challengeCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/40">Hints Used</span>
                                    <span className={`font-black ${hintsUsed === 0 ? 'text-emerald-400' : 'text-yellow-400'}`}>{hintsUsed}</span>
                                </div>
                                {timeTaken > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-white/40">Last Solve Time</span>
                                        <span className={`font-black ${timeTaken < 120 ? 'text-emerald-400' : 'text-white/60'}`}>{timeTaken}s</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Next Challenge */}
                        {solved && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={loadChallenge}
                                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-black hover:opacity-90 transition-all"
                            >
                                Next Challenge →
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Editor */}
                <div className="flex-1 border-r border-white/5 flex flex-col">
                    <div className="h-10 bg-black/20 border-b border-white/5 flex items-center px-6">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
                            Fix The Bug // {challenge?.language === 'python' ? 'main.py' : 'main.js'}
                        </span>
                    </div>
                    <div className="flex-1 py-4">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={challenge?.language || 'javascript'}
                            value={code}
                            loading={<div className="text-red-400 p-8 text-xs">LOADING_DEBUGGER...</div>}
                            onChange={(val) => setCode(val || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
                                scrollBeyondLastLine: false,
                                lineNumbers: 'on',
                                padding: { top: 10, bottom: 10 },
                                automaticLayout: true
                            }}
                        />
                    </div>
                </div>

                {/* Console */}
                <div className="w-[320px] bg-[#050911]/50 flex flex-col">
                    <div className="h-10 bg-black/20 border-b border-white/5 flex items-center px-6 justify-between">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Debug Console</span>
                        <button onClick={() => setOutput([])} className="text-[8px] font-black text-white/10 hover:text-white transition-all uppercase tracking-widest">Clear</button>
                    </div>
                    <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto space-y-2">
                        <AnimatePresence initial={false}>
                            {output.map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`
                                        ${line.startsWith('[SYSTEM]') ? 'text-white/40' : ''}
                                        ${line.startsWith('[MISSION]') ? 'text-yellow-400' : ''}
                                        ${line.startsWith('[BUG TYPE]') ? 'text-red-400/60' : ''}
                                        ${line.startsWith('[INIT]') ? 'text-cyan-400/60' : ''}
                                        ${line.startsWith('[ERROR]') ? 'text-red-400' : ''}
                                        ${line.startsWith('[STDOUT]') ? 'text-emerald-400' : ''}
                                        ${line.startsWith('[SUCCESS]') ? 'text-emerald-400 font-black' : ''}
                                        ${line.startsWith('[PARTIAL]') ? 'text-yellow-400' : ''}
                                        ${line.startsWith('[STATS]') ? 'text-cyan-400/80' : ''}
                                        ${line.startsWith('[SKILL]') ? 'text-purple-400' : ''}
                                    `}
                                >
                                    <span className="mr-2 text-white/10 inline-block w-4">{i + 1}</span>
                                    {line}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isRunning && (
                            <div className="flex items-center gap-2 text-red-400/40 animate-pulse">
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                                <span className="text-[10px] uppercase font-black">Testing Fix...</span>
                            </div>
                        )}
                    </div>

                    {/* Victory Banner */}
                    {solved && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-6 border-t border-emerald-500/20 bg-emerald-500/5"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🏆</span>
                                <div>
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Bug Squashed!</p>
                                    <p className="text-[8px] text-white/40 mt-1">
                                        Solved in {timeTaken}s with {hintsUsed} hint{hintsUsed !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
