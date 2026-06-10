import { ChallengeConfig } from '../data/challenges';

export interface CodeAnalysisResult {
  isValid: boolean;
  feedback?: string;
  originalityScore?: number; // 0-100
}

/**
 * Strips comments, string literals, and normalizes identifiers to generate a structural token sequence.
 * This acts as a poor-man's language-agnostic AST fingerprint to detect structural plagiarism.
 */
export function tokenizeCode(code: string): string[] {
  // Remove multi-line comments and single line comments (basic approximation for JS/Python)
  let cleaned = code.replace(/\/\*[\s\S]*?\*\//g, '');
  cleaned = cleaned.replace(/\/\/.*/g, '');
  cleaned = cleaned.replace(/#.*/g, '');
  
  // Remove string literals
  cleaned = cleaned.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, 'STR');

  // Extract all contiguous alphabetic words, numbers, and symbols
  const tokens = cleaned.match(/[a-zA-Z_]+|[0-9]+|[^a-zA-Z0-9_\s]/g) || [];
  
  const keywords = new Set([
    'def', 'return', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'class',
    'try', 'except', 'function', 'const', 'let', 'var', 'async', 'await', '=>'
  ]);

  return tokens.map(token => {
    if (keywords.has(token)) return token;
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) return 'ID';
    if (/^[0-9]+$/.test(token)) return 'NUM';
    return token;
  });
}

/**
 * Calculates Jaccard similarity between two token sequences (using 3-grams).
 * Returns a score between 0 and 1.
 */
export function calculateStructuralSimilarity(code1: string, code2: string): number {
  const t1 = tokenizeCode(code1);
  const t2 = tokenizeCode(code2);
  
  if (t1.length < 3 || t2.length < 3) return 0;

  const getNGrams = (tokens: string[], n = 3) => {
    const ngrams = new Set<string>();
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.add(tokens.slice(i, i + n).join(' '));
    }
    return ngrams;
  };

  const set1 = getNGrams(t1);
  const set2 = getNGrams(t2);

  let intersection = 0;
  for (const item of set1) {
    if (set2.has(item)) intersection++;
  }
  
  const union = set1.size + set2.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export interface AntiCheatMetrics {
  pasteIncidentCount: number;
  hasSuspiciousPaste: boolean;
  typingSpeedCharsPerSec: number;
  timeSpentSeconds: number;
}

export function analyzeCode(code: string, config?: ChallengeConfig, metrics?: AntiCheatMetrics): CodeAnalysisResult {
  // 0. Anti-Cheat Metrics Gate
  if (metrics) {
    if (metrics.timeSpentSeconds > 0 && metrics.typingSpeedCharsPerSec > 40) {
      return {
        isValid: false,
        feedback: "We detected an unusually high typing speed (>40 chars/sec). Please do not copy-paste complete solutions."
      };
    }
    if (metrics.hasSuspiciousPaste) {
      return {
        isValid: false,
        feedback: "A massive copy-paste event was detected. Path Pilot requires you to write the code yourself to verify your skills."
      };
    }
    if (metrics.timeSpentSeconds < 10) {
      return {
        isValid: false,
        feedback: "You solved this too fast! Spend at least 10 seconds reviewing and writing your solution."
      };
    }
  }

  if (!config) return { isValid: true, originalityScore: 100 };

  // Originality Check against Reference Solution
  let originalityScore = 100;
  if (config.referenceSolution) {
    const similarity = calculateStructuralSimilarity(code, config.referenceSolution);
    originalityScore = Math.max(0, 100 - Math.round(similarity * 100));
    
    // If structural similarity is > 85%, flag as plagiarized from known solution
    if (similarity > 0.85) {
      return {
        isValid: false,
        feedback: "Your code's structure matches our reference solution exactly. Please try to come up with your own original approach, and avoid copy-pasting answers.",
        originalityScore
      };
    }
  }

  const lowerCode = code.toLowerCase();

  // 1. Detect Hardcoded Expected Outputs
  for (const test of config.testCases) {
    if (test.expectedOutput) {
      const expectedStr = test.expectedOutput.toLowerCase().trim();
      if (expectedStr.length > 3) {
        const suspiciousPrintRegex = new RegExp(`(print|console\\.log)\\s*\\(\\s*['"\`]${expectedStr}['"\`]\\s*\\)`, 'i');
        const suspiciousReturnRegex = new RegExp(`return\\s+['"\`]${expectedStr}['"\`]`, 'i');
        
        if (suspiciousPrintRegex.test(lowerCode) || suspiciousReturnRegex.test(lowerCode)) {
          return {
            isValid: false,
            feedback: `We detected hardcoded values matching the expected output ("${test.expectedOutput}"). Please write actual logic to solve the problem.`
          };
        }
      }
    }
  }

  // 2. Detect Wrong Approach (Type Mismatches)
  if (config.validationType === 'exact') {
    const expectsBoolean = config.testCases.some(t => 
      t.expectedOutput.toLowerCase() === 'true' || t.expectedOutput.toLowerCase() === 'false'
    );
    
    if (expectsBoolean) {
      const hasMathOperations = lowerCode.includes('+') || lowerCode.includes('-') || lowerCode.includes('*') || lowerCode.includes('/');
      const printsNumbers = /print\s*\(\s*\d+.*\)/.test(lowerCode) || /console\.log\s*\(\s*\d+.*\)/.test(lowerCode);
      
      if (printsNumbers) {
        return {
          isValid: false,
          feedback: "Hint: Your code solves a different problem. Expected: Boolean function Got: Number output. Try focusing on the prompt."
        };
      }
    }
  }

  // 3. Detect "input()" usage when function parameters are expected
  if (config.testCases.some(t => t.input && t.input.length > 0)) {
    if (lowerCode.includes('def ') && lowerCode.includes('input(')) {
        return {
          isValid: false,
          feedback: "This challenge uses function parameters. Do not use input() inside the function. Use the parameters passed to your function instead."
        };
    }
  }

  return { isValid: true, originalityScore };
}
