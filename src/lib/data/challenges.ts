import { LABS, LAB_IDS_ORDERED } from './labs';
import type { LabDef } from './labs-types';

// ── Types ──────────────────────────────────────────────────────────────────

export interface ChallengeTestCase {
  input?: string;
  expectedOutput: string;
  description?: string;
  timeout?: number;
}

export interface ChallengeConfig {
  labId: string;
  validationType: 'exact' | 'regex' | 'function';
  expectedOutput?: string | RegExp;
  testCases: ChallengeTestCase[];
  hints: string[];
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
