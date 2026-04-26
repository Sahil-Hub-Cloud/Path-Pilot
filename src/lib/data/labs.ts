// ─── PATH PILOT — LAB REGISTRY ────────────────────────────────────────────────
// Add new labs here. The labId must match the URL segment /labs/[labId].
// defaultLang must be a key in the LANGS map in the lab page.

export interface LabTest {
  label:    string;
  input:    string;
  expected: string;
}

export interface LabDef {
  id:          string;
  title:       string;
  category:    string;   // badge shown in the top bar
  difficulty:  'Easy' | 'Medium' | 'Hard';
  xp:          number;
  defaultLang: string;   // key into LANGS — sets the starter file language
  problem:     string;
  expected:    string;   // shown in the "Expected Output" box
  tests:       LabTest[];
  hint:        string;
}

// ─────────────────────────────────────────────────────────────────────────────
export const LABS: Record<string, LabDef> = {

  // ── 1. Python Basics ──────────────────────────────────────────────────────
  'python-basics': {
    id:          'python-basics',
    title:       'Python Basics — FizzBuzz',
    category:    'Python',
    difficulty:  'Easy',
    xp:          15,
    defaultLang: 'python',
    problem: `Write a function fizzbuzz(n) that returns a list of strings from 1 to n where:
  • multiples of 3 are replaced with "Fizz"
  • multiples of 5 are replaced with "Buzz"
  • multiples of both 3 and 5 are replaced with "FizzBuzz"
  • all other numbers are converted to strings

Example:
  fizzbuzz(5) → ["1", "2", "Fizz", "4", "Buzz"]

Print the result list on a single line.`,
    expected: '["1", "2", "Fizz", "4", "Buzz"]',
    tests: [
      { label: 'n = 5',  input: 'fizzbuzz(5)',  expected: '["1", "2", "Fizz", "4", "Buzz"]' },
      { label: 'n = 15 ends with FizzBuzz', input: 'fizzbuzz(15)[-1]', expected: '"FizzBuzz"' },
      { label: 'n = 1',  input: 'fizzbuzz(1)',  expected: '["1"]' },
    ],
    hint: 'Check divisibility with the % operator. Check FizzBuzz (both) FIRST, before checking Fizz or Buzz individually.',
  },

  // ── 2. JavaScript Functions ───────────────────────────────────────────────
  'js-functions': {
    id:          'js-functions',
    title:       'JavaScript — Debounce Factory',
    category:    'JavaScript',
    difficulty:  'Medium',
    xp:          25,
    defaultLang: 'javascript',
    problem: `Implement a debounce(fn, delay) function factory.

debounce(fn, delay) returns a new function. When the new function is called repeatedly, fn only executes once, delay milliseconds after the LAST call.

Example:
  const log = debounce((x) => console.log(x), 300);
  log("a"); log("b"); log("c");
  // After 300ms: logs "c"  (only the last call fires)

For this lab, implement debounce and demonstrate it works by calling the debounced function 3 times and printing the call count after 300ms.
Expected output: 1`,
    expected: '1',
    tests: [
      { label: 'Only last call fires', input: 'call debounced fn 3×',    expected: '1' },
      { label: 'Returns a function',   input: 'typeof debounce(()=>{},0)', expected: 'function' },
      { label: 'Delay respected',      input: 'call count before delay',  expected: '0' },
    ],
    hint: 'Use setTimeout and clearTimeout. Store the timer ID in a closure variable. Each new invocation clears the previous timer before setting a new one.',
  },

  // ── 3. Debugging Challenge ────────────────────────────────────────────────
  'debug-challenge': {
    id:          'debug-challenge',
    title:       'Debug Challenge — Broken Binary Search',
    category:    'Debugging',
    difficulty:  'Medium',
    xp:          20,
    defaultLang: 'python',
    problem: `The function below is supposed to perform binary search but contains THREE bugs. Find and fix all of them. Then print the result of search([1,3,5,7,9,11,13], 7).

Buggy code (copy, fix, then run):

def search(arr, target):
    lo, hi = 0, len(arr)          # Bug 1
    while lo < hi:
        mid = (lo + hi) / 2       # Bug 2  (Python 3)
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid              # Bug 3
        else:
            hi = mid - 1
    return -1

print(search([1,3,5,7,9,11,13], 7))`,
    expected: '3',
    tests: [
      { label: 'Target found — returns index', input: 'search([1,3,5,7,9,11,13], 7)', expected: '3' },
      { label: 'Target not in list',           input: 'search([1,3,5], 4)',            expected: '-1' },
      { label: 'Single element list',          input: 'search([42], 42)',              expected: '0' },
    ],
    hint: 'Bug 1: hi should be len(arr)-1 (last valid index). Bug 2: integer division uses // in Python 3. Bug 3: lo = mid causes an infinite loop — it should be mid + 1.',
  },

  // ── 4. Arrays & Loops ─────────────────────────────────────────────────────
  'arrays-loops': {
    id:          'arrays-loops',
    title:       'Arrays & Loops — Running Average',
    category:    'Arrays',
    difficulty:  'Easy',
    xp:          15,
    defaultLang: 'python',
    problem: `Write a function running_avg(nums) that returns a list where each element is the average of all elements up to and including that index, rounded to 2 decimal places.

Example:
  running_avg([1, 2, 3, 4]) → [1.0, 1.5, 2.0, 2.5]

Print the result list on one line.
Constraint: Solve in a single O(n) pass — do not re-sum the array for each element.`,
    expected: '[1.0, 1.5, 2.0, 2.5]',
    tests: [
      { label: 'Basic 4-element list',   input: 'running_avg([1,2,3,4])',     expected: '[1.0, 1.5, 2.0, 2.5]' },
      { label: 'Single element',         input: 'running_avg([7])',           expected: '[7.0]' },
      { label: 'Decimals round to 2dp',  input: 'running_avg([1,2])',         expected: '[1.0, 1.5]' },
    ],
    hint: 'Keep a running total variable. After each element, divide total by (index + 1) to get the current average. Append round(avg, 2) to your result list.',
  },

  // ── 5. Temporal Reconciliation (original lab — preserved) ─────────────────
  'lab-001': {
    id:          'lab-001',
    title:       'Temporal Reconciliation',
    category:    'Algorithms',
    difficulty:  'Medium',
    xp:          25,
    defaultLang: 'python',
    problem: `Implement a function reconcile_state(prev, curr) that compares two dictionaries and returns a list of keys whose values have changed between the two states.

The algorithm must run in O(n) time complexity — no nested loops allowed.

Example:
  prev = {"a": 1, "b": 2, "c": 3, "d": 4}
  curr = {"a": 1, "b": 9, "c": 3, "d": 7}
  Output: ["b", "d"]`,
    expected: '["b", "d"]',
    tests: [
      { label: 'Basic change detection',  input: 'prev={"a":1,"b":2}, curr={"a":1,"b":9}',             expected: '["b"]' },
      { label: 'Multiple changes',        input: 'prev={"a":1,"b":2,"c":3}, curr={"a":1,"b":9,"c":5}', expected: '["b","c"]' },
      { label: 'No changes',             input: 'prev={"x":1}, curr={"x":1}',                          expected: '[]' },
    ],
    hint: 'Think about using a single-pass dictionary iteration. For each key in prev, check if the value in curr is different. Avoid O(n²) solutions.',
  },

  // ── 6. Track-specific — Full-Stack API Lab ────────────────────────────────
  'api-design': {
    id:          'api-design',
    title:       'REST API — Route Handler',
    category:    'Backend',
    difficulty:  'Hard',
    xp:          35,
    defaultLang: 'javascript',
    problem: `You are building a tiny in-memory REST API for a task list. Implement the following handler function that processes incoming requests:

  handleRequest(method, path, body, store)

Where store is a plain object acting as the database.
Rules:
  • GET  /tasks         → return JSON array of all tasks
  • POST /tasks         → add task {id, title} to store, return {success:true, id}
  • DELETE /tasks/:id   → remove task by id, return {success:true} or {error:"not found"}
  • Any other route     → return {error:"not found"} with no side effects

Print the result of:
  const store = {};
  handleRequest("POST", "/tasks", {id:"1",title:"Build API"}, store);
  console.log(JSON.stringify(handleRequest("GET", "/tasks", null, store)));`,
    expected: '[{"id":"1","title":"Build API"}]',
    tests: [
      { label: 'GET returns all tasks',        input: 'GET /tasks',        expected: '[{"id":"1","title":"Build API"}]' },
      { label: 'POST adds a task',             input: 'POST /tasks',       expected: '{"success":true,"id":"1"}' },
      { label: 'DELETE removes a task',        input: 'DELETE /tasks/1',   expected: '{"success":true}' },
    ],
    hint: 'Use if/else or a switch on method + path. For DELETE, parse the id from the path string with path.split("/")[2]. Keep tasks in store.tasks = store.tasks || [].',
  },

  // ── 7. Cloud & DevOps — Bash / Env Variable Expansion ────────────────────
  'cloud-bash': {
    id:          'cloud-bash',
    title:       'Cloud & DevOps — Bash Env Variables',
    category:    'Cloud & DevOps',
    difficulty:  'Easy',
    xp:          20,
    defaultLang: 'python',
    problem: `DevOps engineers work with environment variables constantly. Simulate bash-style variable expansion in Python.

Write a function expand_env(template, env) where:
  • template is a string like "Deploy to $ENV by $USER"
  • env is a dict like {"ENV": "production", "USER": "devops"}
  • Replace every $VAR with its value from env
  • Leave unrecognised variables as-is (e.g. $UNKNOWN stays $UNKNOWN)

Example:
  expand_env("Deploy to $ENV by $USER", {"ENV": "production", "USER": "devops"})
  → "Deploy to production by devops"

Print the result of the example above.`,
    expected: 'Deploy to production by devops',
    tests: [
      { label: 'Basic substitution',    input: 'expand_env("Hello $NAME", {"NAME": "Alice"})',                                    expected: 'Hello Alice' },
      { label: 'Multiple variables',    input: 'expand_env("Deploy to $ENV by $USER", {"ENV": "production", "USER": "devops"})',  expected: 'Deploy to production by devops' },
      { label: 'Unknown var preserved', input: 'expand_env("Run $UNKNOWN", {})',                                                   expected: 'Run $UNKNOWN' },
    ],
    hint: 'Use re.sub() with a lambda. The pattern r"\\$(\\w+)" matches $VAR words. In the replacement lambda, return env.get(match.group(1), match.group(0)) to keep unknowns intact.',
  },

  // ── 8. Cloud & DevOps — Config File Parser ───────────────────────────────
  'cloud-yaml': {
    id:          'cloud-yaml',
    title:       'Cloud & DevOps — Config File Parser',
    category:    'Cloud & DevOps',
    difficulty:  'Medium',
    xp:          25,
    defaultLang: 'python',
    problem: `DevOps engineers parse config files daily (.env, INI). Write a function parse_config(text) that parses a simplified format:

  • Lines with KEY=VALUE set a variable (strip whitespace around = and values)
  • Lines starting with # are comments — skip them
  • Empty lines are skipped
  • Return a dict of all key-value pairs

Example input (as a multi-line string):
  # Service config
  HOST = localhost
  PORT = 8080
  DEBUG = true

Expected: {"HOST": "localhost", "PORT": "8080", "DEBUG": "true"}

Print len(parse_config(example_text)) — should output 3.`,
    expected: '3',
    tests: [
      { label: 'Parses 3 config keys',  input: 'len(parse_config(text))',      expected: '3' },
      { label: 'Skips comments',        input: '"HOST" in parse_config(text)',  expected: 'True' },
      { label: 'Strips whitespace',     input: 'parse_config(text)["PORT"]',   expected: '8080' },
    ],
    hint: 'Split each line on "=" with maxsplit=1. Use str.strip() on both key and value. Skip lines where the stripped line starts with "#" or is empty.',
  },

  // ── 9. Cloud & DevOps — CI/CD Pipeline Debugger ──────────────────────────
  'cloud-cicd': {
    id:          'cloud-cicd',
    title:       'Cloud & DevOps — Pipeline Debugger',
    category:    'Cloud & DevOps',
    difficulty:  'Hard',
    xp:          35,
    defaultLang: 'python',
    problem: `A CI/CD pipeline runs a sequence of stages. Each stage can pass or fail.
Rule: If any stage FAILS, all subsequent stages are automatically SKIPPED.

Write run_pipeline(stages) where stages is a list of (name, status) tuples
with status "PASS" or "FAIL". Return a list of (name, final_status) tuples.

Example:
  stages = [("build", "PASS"), ("test", "FAIL"), ("deploy", "PASS")]
  run_pipeline(stages)
  → [("build", "PASS"), ("test", "FAIL"), ("deploy", "SKIPPED")]

Print the result of the example above.`,
    expected: "[('build', 'PASS'), ('test', 'FAIL'), ('deploy', 'SKIPPED')]",
    tests: [
      { label: 'Stages skipped after FAIL',  input: 'run_pipeline([("build","PASS"),("test","FAIL"),("deploy","PASS")])', expected: "[('build', 'PASS'), ('test', 'FAIL'), ('deploy', 'SKIPPED')]" },
      { label: 'All pass — no skipping',     input: 'run_pipeline([("lint","PASS"),("build","PASS")])',                  expected: "[('lint', 'PASS'), ('build', 'PASS')]" },
      { label: 'First stage fails',          input: 'run_pipeline([("init","FAIL"),("build","PASS")])',                  expected: "[('init', 'FAIL'), ('build', 'SKIPPED')]" },
    ],
    hint: 'Use a boolean flag `failed = False`. Once you see a "FAIL", set failed = True and output (name, "SKIPPED") for every subsequent stage regardless of its original status.',
  },
};

// Track → first lab mapping (used by dashboard to route to a relevant lab)
export const TRACK_DEFAULT_LAB: Record<string, string> = {
  'Cloud & DevOps':    'cloud-bash',
  'cloud-devops':      'cloud-bash',
  'devops_aws':        'cloud-bash',
  'devops_docker':     'cloud-bash',
  'Backend Dev':       'api-design',
  'backend':           'api-design',
  'backend_node':      'api-design',
  'backend_python':    'api-design',
  'MERN Stack':        'api-design',
  'fullstack_mern':    'api-design',
  'Frontend Dev':      'js-functions',
  'frontend':          'js-functions',
  'frontend_react':    'js-functions',
  'frontend_vue':      'js-functions',
  'DSA & Interviews':  'arrays-loops',
  'dsa_interview':     'arrays-loops',
  'AI Engineering':    'python-basics',
  'ai_nlp':            'python-basics',
  'machine_learning':  'python-basics',
  'data_science_python': 'python-basics',
};

// Ordered list for "browse all labs" features
export const LAB_IDS_ORDERED = [
  'python-basics',
  'js-functions',
  'debug-challenge',
  'arrays-loops',
  'lab-001',
  'api-design',
  'cloud-bash',
  'cloud-yaml',
  'cloud-cicd',
];

