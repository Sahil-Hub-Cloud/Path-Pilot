/**
 * PathPilot Scoring Engine v2.0
 * 
 * Aligned with Technical Specification:
 *   - Syntax: 1.0 - (E * 0.1) where E = error count
 *   - Logic: hints == 0 → +0.1, hints > 2 → −0.05
 *   - Debugging: first attempt +0.1, with hints +0.05, speed bonus +0.02
 *   - Prompt Quality: heuristic analysis of student prompts
 */

// ─── SYNTAX SCORE ────────────────────────────────────────────
/**
 * Syntax score from error count per spec:
 *   new_syntax_score = 1.0 - (E * 0.1)
 *   Clamped to [0.0, 1.0]
 */
export function calculateSyntaxScore(errorCount: number): number {
    return Math.max(0, Math.min(1.0, 1.0 - (errorCount * 0.1)));
}

/**
 * Count errors from stderr output (heuristic: count lines with "Error", "error", etc.)
 */
export function countErrors(stderr: string): number {
    if (!stderr || stderr.trim() === '') return 0;
    const errorLines = stderr.split('\n').filter(line =>
        /error|Error|Traceback|SyntaxError|TypeError|ReferenceError|NameError|IndentationError/i.test(line)
    );
    return Math.max(1, errorLines.length); // At least 1 if stderr exists
}

// ─── LOGIC REASONING SCORE ───────────────────────────────────
/**
 * Logic score delta per spec:
 *   hints_used == 0 → increase by +0.1
 *   hints_used > 2  → decrease by -0.05
 *   otherwise       → no change
 */
export function calculateLogicDelta(hintsUsed: number): number {
    if (hintsUsed === 0) return 0.1;
    if (hintsUsed > 2) return -0.05;
    return 0;
}

// ─── DEBUGGING SCORE ─────────────────────────────────────────
/**
 * Debugging score delta from a debug challenge.
 *   Fixed on first attempt (0 hints) → +0.1
 *   Fixed with hints                 → +0.05
 *   Failed to fix                    → 0
 *   Speed bonus (under 2 min)        → +0.02
 */
export function calculateDebuggingDelta(
    fixed: boolean,
    hintsUsed: number,
    timeSeconds: number
): number {
    if (!fixed) return 0;
    let delta = hintsUsed === 0 ? 0.1 : 0.05;
    if (timeSeconds < 120) delta += 0.02;
    return delta;
}

// ─── PROMPT QUALITY SCORE ────────────────────────────────────
/**
 * Evaluates prompt quality via heuristics.
 *   Length > 30 chars        → +0.01
 *   Length > 80 chars        → +0.01
 *   Mentions specific terms  → +0.02
 *   Asks conceptual "why"    → +0.01
 *   Max delta per prompt: +0.05
 */
export function calculatePromptQualityDelta(prompt: string): number {
    if (!prompt || prompt.trim().length < 10) return 0;
    let delta = 0;

    if (prompt.length > 30) delta += 0.01;
    if (prompt.length > 80) delta += 0.01;

    const specificKeywords = [
        'error', 'TypeError', 'undefined', 'function', 'loop',
        'array', 'object', 'async', 'promise', 'return',
        'why', 'how does', 'explain', 'difference between',
        'what happens when', 'edge case', 'time complexity'
    ];
    if (specificKeywords.some(kw => prompt.toLowerCase().includes(kw.toLowerCase()))) {
        delta += 0.02;
    }

    const conceptual = ['why', 'how does', 'what if', 'explain', 'difference'];
    if (conceptual.some(p => prompt.toLowerCase().includes(p))) {
        delta += 0.01;
    }

    return Math.min(0.05, delta);
}

// ─── COMPOSITE READINESS SCORE ───────────────────────────────
/**
 * Weights:
 *   Syntax    20%
 *   Logic     35% (most important)
 *   Debugging 25%
 *   Prompt    20%
 */
export function computeReadinessScore(
    syntaxScore: number,
    logicScore: number,
    debuggingScore: number,
    promptScore: number
): number {
    const weighted =
        syntaxScore * 0.20 +
        logicScore * 0.35 +
        debuggingScore * 0.25 +
        promptScore * 0.20;
    return +Math.min(1.0, Math.max(0, weighted)).toFixed(3);
}

// ─── SKILL LEVEL LABEL ──────────────────────────────────────
export function getSkillLevel(readiness: number): {
    label: string;
    color: string;
    emoji: string;
} {
    if (readiness >= 0.8) return { label: 'Expert', color: 'text-emerald-400', emoji: '🏆' };
    if (readiness >= 0.6) return { label: 'Proficient', color: 'text-blue-400', emoji: '⚡' };
    if (readiness >= 0.4) return { label: 'Developing', color: 'text-yellow-400', emoji: '🔧' };
    if (readiness >= 0.2) return { label: 'Beginner', color: 'text-orange-400', emoji: '🌱' };
    return { label: 'Novice', color: 'text-red-400', emoji: '🔴' };
}
