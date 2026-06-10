import { LABS, LAB_IDS_ORDERED } from './labs';
import type { LabDef } from './labs-types';

// ── Types ──────────────────────────────────────────────────────────────────

export interface ChallengeTestCase {
  input?: string;
  expectedOutput: string;
  description?: string;
  timeout?: number;
}

export interface ChallengeVariation {
  id: string;
  problem: string;
  titleSuffix?: string;
  expectedOutput?: string | RegExp;
  testCases: ChallengeTestCase[];
  hints?: string[];
  starterCode?: string;
}

export interface ChallengeConfig {
  labId: string;
  validationType: 'exact' | 'regex' | 'function';
  expectedOutput?: string | RegExp;
  testCases: ChallengeTestCase[];
  hints: string[];
  referenceSolution?: string;
  variations?: ChallengeVariation[];
  needsVerification?: boolean; // true = auto-generated, admin should review
}

// ── Hand-crafted tests for legacy labs ──────────────────────────────────────

const MANUAL_TESTS: Record<string, ChallengeConfig> = {
  'python-basics': {
    labId: 'python-basics',
    validationType: 'exact',
    testCases: [
      { input: '5', expectedOutput: '["1", "2", "Fizz", "4", "Buzz"]', description: 'fizzbuzz(5)' },
      { input: '15', expectedOutput: '"FizzBuzz"', description: 'fizzbuzz(15) last element' },
      { input: '1', expectedOutput: '["1"]', description: 'fizzbuzz(1)' }
    ],
    hints: [
      'Check divisibility with the % operator.',
      'Check FizzBuzz (both 3 and 5) FIRST, before checking Fizz or Buzz individually.'
    ],
    referenceSolution: `def fizzbuzz(n):
    res = []
    for i in range(1, n + 1):
        if i % 3 == 0 and i % 5 == 0:
            res.append("FizzBuzz")
        elif i % 3 == 0:
            res.append("Fizz")
        elif i % 5 == 0:
            res.append("Buzz")
        else:
            res.append(str(i))
    return res`,
    variations: [
      {
        id: 'python-basics-var-1',
        titleSuffix: 'FizzBuzz Variation A',
        problem: 'Write a function fizzbuzz(n) that returns a list of strings from 1 to n where multiples of 3 are "Fizz", multiples of 5 are "Buzz", and both are "FizzBuzz".\n\nExample: fizzbuzz(5) → ["1", "2", "Fizz", "4", "Buzz"]\n\nPrint the result list on a single line.',
        starterCode: '# Complete this function\n\ndef fizzbuzz(n):\n    # Your code here\n    pass\n\n# Test automatically\nprint(fizzbuzz(5))',
        testCases: [
          { input: '5', expectedOutput: '["1", "2", "Fizz", "4", "Buzz"]', description: 'fizzbuzz(5)' },
          { input: '15', expectedOutput: '"FizzBuzz"', description: 'fizzbuzz(15) last element' }
        ]
      },
      {
        id: 'python-basics-var-2',
        titleSuffix: 'FizzBuzz Variation B',
        problem: 'Write a function fizzbuzz_up_to(limit) that returns a list of strings from 1 to limit where multiples of 3 are "Fizz", multiples of 5 are "Buzz", and both are "FizzBuzz".\n\nExample: fizzbuzz_up_to(5) → ["1", "2", "Fizz", "4", "Buzz"]\n\nPrint the result list on a single line.',
        starterCode: '# Complete this function\n\ndef fizzbuzz_up_to(limit):\n    # Your code here\n    pass\n\n# Test automatically\nprint(fizzbuzz_up_to(5))',
        testCases: [
          { input: '5', expectedOutput: '["1", "2", "Fizz", "4", "Buzz"]', description: 'fizzbuzz_up_to(5)' },
          { input: '15', expectedOutput: '"FizzBuzz"', description: 'fizzbuzz_up_to(15) last element' }
        ]
      }
    ]
  },
  'toggle-flag': {
    labId: 'toggle-flag',
    validationType: 'exact',
    testCases: [
      { input: 'True', expectedOutput: 'False', description: 'toggle_flag(True) → False' },
      { input: 'False', expectedOutput: 'True', description: 'toggle_flag(False) → True' }
    ],
    hints: [
      'Use: return not current',
      'Return the opposite boolean'
    ],
    referenceSolution: `def toggle_flag(current):\n    return not current`,
    variations: [
      {
        id: 'toggle-flag-var-1',
        titleSuffix: 'Toggle Flag A',
        problem: 'Complete the function `toggle_flag(current)` that takes a boolean value and returns its opposite (True becomes False, and False becomes True).\n\nDo not use `input()`.',
        starterCode: '# Complete this function\n\ndef toggle_flag(current):\n    # Your code here\n    pass\n\nprint(toggle_flag(True))\nprint(toggle_flag(False))',
        testCases: [
          { input: 'print(toggle_flag(True))', expectedOutput: 'False', description: 'toggle_flag(True)' },
          { input: 'print(toggle_flag(False))', expectedOutput: 'True', description: 'toggle_flag(False)' }
        ]
      },
      {
        id: 'toggle-flag-var-2',
        titleSuffix: 'Invert Boolean B',
        problem: 'Complete the function `invert_boolean(value)` that takes a boolean value and returns its opposite.\n\nDo not use `input()`.',
        starterCode: '# Complete this function\n\ndef invert_boolean(value):\n    # Your code here\n    pass\n\nprint(invert_boolean(True))\nprint(invert_boolean(False))',
        testCases: [
          { input: 'print(invert_boolean(True))', expectedOutput: 'False', description: 'invert_boolean(True)' },
          { input: 'print(invert_boolean(False))', expectedOutput: 'True', description: 'invert_boolean(False)' }
        ]
      }
    ]
  },
  'debug-challenge': {
    labId: 'debug-challenge',
    validationType: 'exact',
    testCases: [
      { expectedOutput: '3', description: 'search([1,3,5,7,9,11,13], 7) returns index 3' },
      { expectedOutput: '-1', description: 'search([1,3,5], 4) returns -1' },
      { expectedOutput: '0', description: 'search([42], 42) returns 0' }
    ],
    hints: [
      'Bug 1: hi should be len(arr)-1 (last valid index).',
      'Bug 2: Use integer division // in Python 3.',
      'Bug 3: lo = mid causes infinite loop — use lo = mid + 1.'
    ]
  },
  'arrays-loops': {
    labId: 'arrays-loops',
    validationType: 'exact',
    testCases: [
      { expectedOutput: '[1.0, 1.5, 2.0, 2.5]', description: 'running_avg([1,2,3,4])' },
      { expectedOutput: '[7.0]', description: 'running_avg([7]) single element' },
      { expectedOutput: '[1.0, 1.5]', description: 'running_avg([1,2]) two elements' }
    ],
    hints: [
      'Keep a running total variable.',
      'After each element, divide total by (index + 1) to get the current average.'
    ]
  },
  'lab-001': {
    labId: 'lab-001',
    validationType: 'exact',
    testCases: [
      { expectedOutput: '["b"]', description: 'Single key changed' },
      { expectedOutput: '["b","c"]', description: 'Multiple changes detected' },
      { expectedOutput: '[]', description: 'No changes → empty list' }
    ],
    hints: [
      'Use a single-pass dictionary iteration.',
      'For each key in prev, check if the value in curr is different.'
    ]
  },
  'js-functions': {
    labId: 'js-functions',
    validationType: 'exact',
    testCases: [
      { expectedOutput: '1', description: 'Only last call fires (debounce)' },
      { expectedOutput: 'function', description: 'Returns a function type' }
    ],
    hints: [
      'Use setTimeout and clearTimeout.',
      'Store the timer ID in a closure variable.'
    ]
  },
  'api-design': {
    labId: 'api-design',
    validationType: 'exact',
    testCases: [
      { expectedOutput: '[{"id":"1","title":"Build API"}]', description: 'GET /tasks returns all tasks' },
      { expectedOutput: '{"success":true,"id":"1"}', description: 'POST /tasks adds a task' },
      { expectedOutput: '{"success":true}', description: 'DELETE /tasks/1 removes task' }
    ],
    hints: [
      'Use if/else or a switch on method + path.',
      'For DELETE, parse the id from the path string with path.split("/")[2].'
    ]
  },
  'cloud-bash': {
    labId: 'cloud-bash',
    validationType: 'exact',
    testCases: [
      { expectedOutput: 'Hello Alice', description: 'Basic variable substitution' },
      { expectedOutput: 'Deploy to production by devops', description: 'Multiple variables' },
      { expectedOutput: 'Run $UNKNOWN', description: 'Unknown var preserved' }
    ],
    hints: [
      'Use re.sub() with a lambda.',
      'Pattern: r"\\$(\\w+)" matches $VAR words.'
    ]
  },
  'cloud-yaml': {
    labId: 'cloud-yaml',
    validationType: 'exact',
    testCases: [
      { expectedOutput: '3', description: 'Parses 3 config keys' },
      { expectedOutput: 'True', description: 'HOST key exists' },
      { expectedOutput: '8080', description: 'PORT value is correct' }
    ],
    hints: [
      'Split each line on "=" with maxsplit=1.',
      'Use str.strip() on both key and value.'
    ]
  },
  'cloud-cicd': {
    labId: 'cloud-cicd',
    validationType: 'exact',
    testCases: [
      { expectedOutput: "[('build', 'PASS'), ('test', 'FAIL'), ('deploy', 'SKIPPED')]", description: 'Stages skipped after FAIL' },
      { expectedOutput: "[('lint', 'PASS'), ('build', 'PASS')]", description: 'All pass — no skipping' },
      { expectedOutput: "[('init', 'FAIL'), ('build', 'SKIPPED')]", description: 'First stage fails' }
    ],
    hints: [
      'Use a boolean flag: failed = False.',
      'Once you see a "FAIL", set failed = True and output "SKIPPED" for all subsequent stages.'
    ]
  },
};

// ── Auto-generate tests from any LabDef that has tests[] ────────────────────

function autoGenerateConfig(lab: LabDef): ChallengeConfig {
  return {
    labId: lab.id,
    validationType: 'exact',
    testCases: lab.tests.map(t => ({
      expectedOutput: t.expected,
      description: t.label,
      input: t.input
    })),
    hints: [lab.hint],
    needsVerification: true,
  };
}

// ── Build Universal Registry ────────────────────────────────────────────────

function buildChallengeRegistry(): Record<string, ChallengeConfig> {
  const registry: Record<string, ChallengeConfig> = { ...MANUAL_TESTS };

  // Fill in from all registered labs (both legacy & course-generated)
  for (const labId of LAB_IDS_ORDERED) {
    if (registry[labId]) continue;     // manual test already exists
    const lab = LABS[labId];
    if (lab && lab.tests && lab.tests.length > 0) {
      registry[labId] = autoGenerateConfig(lab);
    }
  }

  // Also scan LABS keys in case some weren't in LAB_IDS_ORDERED
  for (const [labId, lab] of Object.entries(LABS)) {
    if (registry[labId]) continue;
    if (lab.tests && lab.tests.length > 0) {
      registry[labId] = autoGenerateConfig(lab);
    }
  }

  return registry;
}

export const CHALLENGE_TESTS: Record<string, ChallengeConfig> = buildChallengeRegistry();

// ── Utilities ───────────────────────────────────────────────────────────────

/** Returns lab IDs that need manual review of auto-generated tests. */
export function getUnverifiedChallenges(): string[] {
  return Object.values(CHALLENGE_TESTS)
    .filter(c => c.needsVerification)
    .map(c => c.labId);
}

/** Returns lab IDs that have no test configuration at all. */
export function getUnconfiguredLabs(): string[] {
  return Object.keys(LABS).filter(id => !CHALLENGE_TESTS[id]);
}
