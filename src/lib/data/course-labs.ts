/**
 * Per-course lab registry — at least 3 unique labs per track.
 * Lab IDs follow: {courseId}-lab-{1|2|3}
 */
import type { LabDef, LabTest } from './labs-types';
import { COURSES } from './course-map';

type LabTemplate = Omit<LabDef, 'id' | 'title'> & { titleSuffix: string };

const PYTHON_LABS: [LabTemplate, LabTemplate, LabTemplate] = [
  {
    titleSuffix: 'List Comprehensions',
    category: 'Python',
    difficulty: 'Easy',
    xp: 15,
    defaultLang: 'python',
    problem: `Write a function squares_up_to(n) that returns a list of squares from 1² to n² using a list comprehension.\n\nExample: squares_up_to(4) → [1, 4, 9, 16]\n\nPrint squares_up_to(5).`,
    expected: '[1, 4, 9, 16, 25]',
    tests: [
      { label: 'n=5', input: 'squares_up_to(5)', expected: '[1, 4, 9, 16, 25]' },
      { label: 'n=1', input: 'squares_up_to(1)', expected: '[1]' },
      { label: 'n=3', input: 'len(squares_up_to(3))', expected: '3' },
    ],
    hint: 'Use [i*i for i in range(1, n+1)].',
  },
  {
    titleSuffix: 'Dictionary Merge',
    category: 'Python',
    difficulty: 'Medium',
    xp: 20,
    defaultLang: 'python',
    problem: `Write merge_counts(a, b) that merges two dicts of word→count, summing values for shared keys.\n\nExample: merge_counts({"a":1,"b":2}, {"b":3,"c":1}) → {"a":1,"b":5,"c":1}\n\nPrint merge_counts({"x":2}, {"x":1,"y":4}).`,
    expected: "{'x': 3, 'y': 4}",
    tests: [
      { label: 'Merge shared key', input: "merge_counts({'x':2},{'x':1,'y':4})", expected: "{'x': 3, 'y': 4}" },
      { label: 'Empty second dict', input: "merge_counts({'a':1},{})", expected: "{'a': 1}" },
      { label: 'Both empty', input: 'len(merge_counts({},{}))', expected: '0' },
    ],
    hint: 'Iterate keys from both dicts using set(a)|set(b).',
  },
  {
    titleSuffix: 'File Line Counter',
    category: 'Python',
    difficulty: 'Hard',
    xp: 30,
    defaultLang: 'python',
    problem: `Write count_nonempty_lines(text) returning the number of non-empty, non-comment lines (lines starting with # after strip are comments).\n\nPrint count_nonempty_lines("a\\n\\n# hi\\nb").`,
    expected: '2',
    tests: [
      { label: 'Skips blank and comment', input: 'count_nonempty_lines("a\\n\\n# hi\\nb")', expected: '2' },
      { label: 'All comments', input: 'count_nonempty_lines("# only\\n# lines")', expected: '0' },
      { label: 'Single line', input: 'count_nonempty_lines("code")', expected: '1' },
    ],
    hint: 'Split on newlines, strip each line, skip empty and lines starting with #.',
  },
];

const JS_LABS: [LabTemplate, LabTemplate, LabTemplate] = [
  {
    titleSuffix: 'Array Filter Map',
    category: 'JavaScript',
    difficulty: 'Easy',
    xp: 15,
    defaultLang: 'javascript',
    problem: `Write doubleEvens(nums) that filters even numbers and doubles them.\n\nExample: doubleEvens([1,2,3,4]) → [4, 8]\n\nLog JSON.stringify(doubleEvens([1,2,3,4,5,6])).`,
    expected: '[4,8,12]',
    tests: [
      { label: 'Basic', input: 'doubleEvens([1,2,3,4,5,6])', expected: '[4,8,12]' },
      { label: 'No evens', input: 'doubleEvens([1,3])', expected: '[]' },
      { label: 'All evens', input: 'doubleEvens([2,4])', expected: '[4,8]' },
    ],
    hint: 'Use filter(n => n%2===0) then map(n => n*2).',
  },
  {
    titleSuffix: 'Object Key Transform',
    category: 'JavaScript',
    difficulty: 'Medium',
    xp: 20,
    defaultLang: 'javascript',
    problem: `Write snakeToCamel(obj) converting snake_case keys to camelCase (one level only).\n\nExample: snakeToCamel({user_name:"A"}) → {userName:"A"}`,
    expected: '{"userName":"A"}',
    tests: [
      { label: 'Single key', input: 'JSON.stringify(snakeToCamel({user_name:"A"}))', expected: '{"userName":"A"}' },
      { label: 'Multiple keys', input: 'Object.keys(snakeToCamel({a_b:1,c_d:2})).length', expected: '2' },
      { label: 'Empty object', input: 'JSON.stringify(snakeToCamel({}))', expected: '{}' },
    ],
    hint: 'Split key on _, capitalize parts after the first.',
  },
  {
    titleSuffix: 'Promise Retry',
    category: 'JavaScript',
    difficulty: 'Hard',
    xp: 30,
    defaultLang: 'javascript',
    problem: `Write async function retry(fn, times) that calls fn() up to times attempts until it succeeds, then returns the result. Throw the last error if all fail.`,
    expected: 'ok',
    tests: [
      { label: 'Succeeds first try', input: 'await retry(async()=>"ok",3)', expected: 'ok' },
      { label: 'Function type', input: 'typeof retry', expected: 'function' },
      { label: 'Returns promise', input: 'retry(async()=>1,1) instanceof Promise', expected: 'true' },
    ],
    hint: 'Use a for loop with try/catch around await fn().',
  },
];

const DSA_LABS: [LabTemplate, LabTemplate, LabTemplate] = [
  {
    titleSuffix: 'Two Sum Indices',
    category: 'DSA',
    difficulty: 'Easy',
    xp: 15,
    defaultLang: 'python',
    problem: `Write two_sum(nums, target) returning indices [i,j] where nums[i]+nums[j]=target (exactly one solution).\n\nPrint two_sum([2,7,11,15], 9).`,
    expected: '[0, 1]',
    tests: [
      { label: 'Classic', input: 'two_sum([2,7,11,15],9)', expected: '[0, 1]' },
      { label: 'Different pair', input: 'two_sum([3,2,4],6)', expected: '[1, 2]' },
      { label: 'Duplicate values', input: 'two_sum([3,3],6)', expected: '[0, 1]' },
    ],
    hint: 'Use a hash map of value→index while scanning.',
  },
  {
    titleSuffix: 'Valid Parentheses',
    category: 'DSA',
    difficulty: 'Medium',
    xp: 20,
    defaultLang: 'python',
    problem: `Write is_valid_parens(s) returning True if brackets ()[]{} are properly closed.\n\nPrint is_valid_parens("{[]}")`,
    expected: 'True',
    tests: [
      { label: 'Nested valid', input: 'is_valid_parens("{[]}")', expected: 'True' },
      { label: 'Invalid order', input: 'is_valid_parens("(]")', expected: 'False' },
      { label: 'Empty string', input: 'is_valid_parens("")', expected: 'True' },
    ],
    hint: 'Use a stack; push opens, pop and match on closes.',
  },
  {
    titleSuffix: 'Binary Search',
    category: 'DSA',
    difficulty: 'Hard',
    xp: 30,
    defaultLang: 'python',
    problem: `Write binary_search(arr, target) returning index or -1. arr is sorted.\n\nPrint binary_search([1,3,5,7], 5)`,
    expected: '2',
    tests: [
      { label: 'Found', input: 'binary_search([1,3,5,7],5)', expected: '2' },
      { label: 'Not found', input: 'binary_search([1,3,5],4)', expected: '-1' },
      { label: 'First element', input: 'binary_search([2,4,6],2)', expected: '0' },
    ],
    hint: 'lo, hi pointers; mid = (lo+hi)//2.',
  },
];

const DEVOPS_LABS: [LabTemplate, LabTemplate, LabTemplate] = [
  {
    titleSuffix: 'Env Expansion',
    category: 'DevOps',
    difficulty: 'Easy',
    xp: 15,
    defaultLang: 'python',
    problem: `Write expand_env(template, env) replacing $VAR tokens from env dict.\n\nPrint expand_env("Deploy $ENV", {"ENV":"prod"})`,
    expected: 'Deploy prod',
    tests: [
      { label: 'Substitute', input: 'expand_env("Deploy $ENV", {"ENV":"prod"})', expected: 'Deploy prod' },
      { label: 'Unknown kept', input: 'expand_env("$X", {})', expected: '$X' },
      { label: 'Multiple vars', input: 'expand_env("$A-$B", {"A":"1","B":"2"})', expected: '1-2' },
    ],
    hint: 'Regex replace \\$(\\w+) with env lookup.',
  },
  {
    titleSuffix: 'Pipeline Stages',
    category: 'DevOps',
    difficulty: 'Medium',
    xp: 20,
    defaultLang: 'python',
    problem: `Write run_pipeline(stages) where each (name,status) becomes SKIPPED after first FAIL.\n\nPrint run_pipeline([("build","PASS"),("test","FAIL"),("deploy","PASS")])`,
    expected: "[('build', 'PASS'), ('test', 'FAIL'), ('deploy', 'SKIPPED')]",
    tests: [
      { label: 'Skip after fail', input: 'run_pipeline([("build","PASS"),("test","FAIL"),("deploy","PASS")])', expected: "[('build', 'PASS'), ('test', 'FAIL'), ('deploy', 'SKIPPED')]" },
      { label: 'All pass', input: 'run_pipeline([("a","PASS")])', expected: "[('a', 'PASS')]" },
      { label: 'First fails', input: 'run_pipeline([("a","FAIL"),("b","PASS")])', expected: "[('a', 'FAIL'), ('b', 'SKIPPED')]" },
    ],
    hint: 'Track failed flag after first FAIL.',
  },
  {
    titleSuffix: 'Config Parser',
    category: 'DevOps',
    difficulty: 'Hard',
    xp: 30,
    defaultLang: 'python',
    problem: `Write parse_config(text) parsing KEY=VALUE lines, skipping # comments and blanks.\n\nPrint len(parse_config("HOST=localhost\\n#c\\nPORT=8080"))`,
    expected: '2',
    tests: [
      { label: 'Two keys', input: 'len(parse_config("HOST=localhost\\n#c\\nPORT=8080"))', expected: '2' },
      { label: 'Comments only', input: 'len(parse_config("# hi"))', expected: '0' },
      { label: 'Strip spaces', input: 'parse_config("A = 1")["A"]', expected: '1' },
    ],
    hint: 'Split lines, strip, skip empty and # lines.',
  },
];

const MOBILE_LABS: [LabTemplate, LabTemplate, LabTemplate] = [
  {
    titleSuffix: 'Widget State',
    category: 'Mobile',
    difficulty: 'Easy',
    xp: 15,
    defaultLang: 'javascript',
    problem: `Write toggle_flag(current) returning the opposite boolean (simulates UI toggle state).\n\nLog toggle_flag(false)`,
    expected: 'true',
    tests: [
      { label: 'False to true', input: 'toggle_flag(false)', expected: 'true' },
      { label: 'True to false', input: 'toggle_flag(true)', expected: 'false' },
      { label: 'Double toggle', input: 'toggle_flag(toggle_flag(true))', expected: 'true' },
    ],
    hint: 'Return !current.',
  },
  {
    titleSuffix: 'Navigation Stack',
    category: 'Mobile',
    difficulty: 'Medium',
    xp: 20,
    defaultLang: 'javascript',
    problem: `Write nav_push(stack, screen) returning new stack with screen appended.\n\nLog JSON.stringify(nav_push(["Home"],"Profile"))`,
    expected: '["Home","Profile"]',
    tests: [
      { label: 'Push screen', input: 'JSON.stringify(nav_push(["Home"],"Profile"))', expected: '["Home","Profile"]' },
      { label: 'Empty stack', input: 'JSON.stringify(nav_push([],"A"))', expected: '["A"]' },
      { label: 'Immutable', input: 'nav_push(["A"],"B").length', expected: '2' },
    ],
    hint: 'Return [...stack, screen] without mutating.',
  },
  {
    titleSuffix: 'Form Validation',
    category: 'Mobile',
    difficulty: 'Hard',
    xp: 30,
    defaultLang: 'javascript',
    problem: `Write validate_email(email) returning true if email contains @ and a dot after @.\n\nLog validate_email("user@mail.com")`,
    expected: 'true',
    tests: [
      { label: 'Valid', input: 'validate_email("user@mail.com")', expected: 'true' },
      { label: 'No dot', input: 'validate_email("user@mail")', expected: 'false' },
      { label: 'No at', input: 'validate_email("user.mail.com")', expected: 'false' },
    ],
    hint: 'Split on @, check parts.length===2 and parts[1] includes ".".',
  },
];

const COURSE_LAB_TEMPLATES: Record<string, [LabTemplate, LabTemplate, LabTemplate]> = {
  'python-beginners': PYTHON_LABS,
  'backend-django': PYTHON_LABS,
  'data-science': PYTHON_LABS,
  'machine-learning': PYTHON_LABS,
  'nlp': PYTHON_LABS,
  'ai-ml-engineer': PYTHON_LABS,
  'data-engineering': PYTHON_LABS,
  'frontend-react': JS_LABS,
  'backend-nodejs': JS_LABS,
  'fullstack-mern': JS_LABS,
  'frontend-vue': JS_LABS,
  'javascript-mastery': JS_LABS,
  'react-native': JS_LABS,
  'web3-pro': JS_LABS,
  'blockchain': JS_LABS,
  'dsa-interviews': DSA_LABS,
  'docker-kubernetes': DEVOPS_LABS,
  'devops-aws': DEVOPS_LABS,
  'cloud-native': DEVOPS_LABS,
  'cybersecurity': DEVOPS_LABS,
  'flutter': MOBILE_LABS,
  'android-kotlin': MOBILE_LABS,
};

function buildLab(courseId: string, courseLabel: string, index: number, tpl: LabTemplate): LabDef {
  const id = `${courseId}-lab-${index + 1}`;
  return {
    id,
    courseId,
    title: `${courseLabel} — ${tpl.titleSuffix}`,
    category: tpl.category,
    difficulty: tpl.difficulty,
    xp: tpl.xp,
    defaultLang: tpl.defaultLang,
    problem: tpl.problem,
    expected: tpl.expected,
    tests: tpl.tests as LabTest[],
    hint: tpl.hint,
  };
}

export function buildCourseLabsRegistry(): Record<string, LabDef> {
  const registry: Record<string, LabDef> = {};
  for (const course of COURSES) {
    const templates = COURSE_LAB_TEMPLATES[course.courseId] || JS_LABS;
    templates.forEach((tpl, i) => {
      const lab = buildLab(course.courseId, course.label, i, tpl);
      registry[lab.id] = lab;
    });
  }
  return registry;
}

/** Lab IDs for a course (always 3). */
export function getCourseLabIds(courseId: string): string[] {
  return [1, 2, 3].map((n) => `${courseId}-lab-${n}`);
}

/** Pick a course lab for a topic (stable hash). */
export function getLabForTopic(courseId: string, topicId: string): string {
  const ids = getCourseLabIds(courseId);
  let hash = 0;
  for (let i = 0; i < topicId.length; i++) hash = (hash + topicId.charCodeAt(i)) % ids.length;
  return ids[hash] || ids[0];
}

export function getLabsForCourse(courseId: string, labs: Record<string, LabDef>): LabDef[] {
  return getCourseLabIds(courseId).map((id) => labs[id]).filter(Boolean);
}
