import { ChallengeConfig } from '../data/challenges';

export interface CodeAnalysisResult {
  isValid: boolean;
  feedback?: string;
}

export function analyzeCode(code: string, config?: ChallengeConfig): CodeAnalysisResult {
  if (!config) return { isValid: true };

  const lowerCode = code.toLowerCase();

  // 1. Detect Hardcoded Expected Outputs
  // E.g., if expected output is "True" and they just write print("True")
  for (const test of config.testCases) {
    if (test.expectedOutput) {
      const expectedStr = test.expectedOutput.toLowerCase().trim();
      // Only penalize if it's a direct print or console.log of the exact expected answer,
      // and it's long enough to be suspicious (e.g. not just "0" or "1")
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
    // If the challenge explicitly mentions returning boolean but code prints numbers
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
    // If it's a python file and uses input() but the prompt implies a function wrapper
    if (lowerCode.includes('def ') && lowerCode.includes('input(')) {
        // Just a gentle hint, not strictly an invalidation, but we'll mark it invalid to force correction
        return {
          isValid: false,
          feedback: "This challenge uses function parameters. Do not use input() inside the function. Use the parameters passed to your function instead."
        };
    }
  }

  return { isValid: true };
}
