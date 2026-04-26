/**
 * PathPilot Broken Code Challenge Library
 * 
 * 25 buggy code snippets across JavaScript & Python covering
 * common bug categories that students encounter in real projects.
 */

export interface BrokenCodeChallenge {
    id: string;
    title: string;
    language: 'javascript' | 'python';
    bugType: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    brokenCode: string;
    hint: string;
    solution: string;
    expectedOutput: string;
}

export const BROKEN_CODE_CHALLENGES: BrokenCodeChallenge[] = [
    // ═══ JAVASCRIPT — EASY ═══
    {
        id: 'js-easy-1',
        title: 'The Vanishing Variable',
        language: 'javascript',
        bugType: 'Scope Error',
        difficulty: 'Easy',
        description: 'This function should return the doubled value, but it returns undefined.',
        brokenCode: `function doubleIt(x) {
  let result;
  if (x > 0) {
    let result = x * 2;
  }
  return result;
}
console.log(doubleIt(5));`,
        hint: 'Look at where `result` is declared. Are both `result` variables the same?',
        solution: `function doubleIt(x) {
  let result;
  if (x > 0) {
    result = x * 2;
  }
  return result;
}
console.log(doubleIt(5));`,
        expectedOutput: '10'
    },
    {
        id: 'js-easy-2',
        title: 'The Infinite Greeter',
        language: 'javascript',
        bugType: 'Infinite Loop',
        difficulty: 'Easy',
        description: 'This loop should print "Hello" 5 times but it runs forever.',
        brokenCode: `let i = 0;
while (i < 5) {
  console.log("Hello " + i);
}`,
        hint: 'What changes the value of `i` inside the loop?',
        solution: `let i = 0;
while (i < 5) {
  console.log("Hello " + i);
  i++;
}`,
        expectedOutput: 'Hello 0'
    },
    {
        id: 'js-easy-3',
        title: 'The Confused Equality',
        language: 'javascript',
        bugType: 'Type Coercion',
        difficulty: 'Easy',
        description: 'This function should return "match" only when value is the number 0, not the string "0".',
        brokenCode: `function checkZero(value) {
  if (value == 0) {
    return "match";
  }
  return "no match";
}
console.log(checkZero("0"));
console.log(checkZero(0));`,
        hint: 'Think about `==` vs `===` in JavaScript.',
        solution: `function checkZero(value) {
  if (value === 0) {
    return "match";
  }
  return "no match";
}
console.log(checkZero("0"));
console.log(checkZero(0));`,
        expectedOutput: 'no match'
    },
    {
        id: 'js-easy-4',
        title: 'The Off-by-One',
        language: 'javascript',
        bugType: 'Off-by-One Error',
        difficulty: 'Easy',
        description: 'This function should return the last element of an array.',
        brokenCode: `function getLast(arr) {
  return arr[arr.length];
}
console.log(getLast([10, 20, 30]));`,
        hint: 'Array indices start at 0. If length is 3, what is the last valid index?',
        solution: `function getLast(arr) {
  return arr[arr.length - 1];
}
console.log(getLast([10, 20, 30]));`,
        expectedOutput: '30'
    },
    {
        id: 'js-easy-5',
        title: 'The Missing Return',
        language: 'javascript',
        bugType: 'Missing Return',
        difficulty: 'Easy',
        description: 'This function should add two numbers but prints undefined.',
        brokenCode: `function add(a, b) {
  a + b;
}
console.log(add(3, 4));`,
        hint: 'JavaScript functions need an explicit return statement.',
        solution: `function add(a, b) {
  return a + b;
}
console.log(add(3, 4));`,
        expectedOutput: '7'
    },

    // ═══ JAVASCRIPT — MEDIUM ═══
    {
        id: 'js-med-1',
        title: 'The Callback Trap',
        language: 'javascript',
        bugType: 'Async/Callback Error',
        difficulty: 'Medium',
        description: 'This code should print numbers 0-4, each after a delay, but it prints 5 five times.',
        brokenCode: `for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i);
  }, 100);
}`,
        hint: 'What is the value of `i` when the callbacks actually execute? Think about `var` vs `let`.',
        solution: `for (let i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i);
  }, 100);
}`,
        expectedOutput: '0'
    },
    {
        id: 'js-med-2',
        title: 'The Broken Filter',
        language: 'javascript',
        bugType: 'Array Method Misuse',
        difficulty: 'Medium',
        description: 'This should filter out even numbers but returns an empty array.',
        brokenCode: `const numbers = [1, 2, 3, 4, 5, 6];
const odds = numbers.filter(function(n) {
  n % 2 !== 0;
});
console.log(odds);`,
        hint: 'The filter callback needs to explicitly return a value.',
        solution: `const numbers = [1, 2, 3, 4, 5, 6];
const odds = numbers.filter(function(n) {
  return n % 2 !== 0;
});
console.log(odds);`,
        expectedOutput: '1,3,5'
    },
    {
        id: 'js-med-3',
        title: 'The String Trap',
        language: 'javascript',
        bugType: 'Type Error',
        difficulty: 'Medium',
        description: 'This should calculate the sum of input numbers but concatenates them as strings.',
        brokenCode: `function sumInputs(a, b) {
  return a + b;
}
console.log(sumInputs("5", "3"));`,
        hint: 'What type are the arguments? What does `+` do with strings?',
        solution: `function sumInputs(a, b) {
  return Number(a) + Number(b);
}
console.log(sumInputs("5", "3"));`,
        expectedOutput: '8'
    },
    {
        id: 'js-med-4',
        title: 'The Mutant Array',
        language: 'javascript',
        bugType: 'Reference vs Value',
        difficulty: 'Medium',
        description: 'Modifying `copy` should not change `original`, but it does.',
        brokenCode: `const original = [1, 2, 3];
const copy = original;
copy.push(4);
console.log(original.length);`,
        hint: 'Arrays are reference types. How do you make a true copy?',
        solution: `const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original.length);`,
        expectedOutput: '3'
    },
    {
        id: 'js-med-5',
        title: 'The Broken Recursion',
        language: 'javascript',
        bugType: 'Missing Base Case',
        difficulty: 'Medium',
        description: 'This factorial function causes stack overflow.',
        brokenCode: `function factorial(n) {
  return n * factorial(n - 1);
}
console.log(factorial(5));`,
        hint: 'Every recursion needs a base case. When should it stop?',
        solution: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
console.log(factorial(5));`,
        expectedOutput: '120'
    },

    // ═══ PYTHON — EASY ═══
    {
        id: 'py-easy-1',
        title: 'The Indent Disaster',
        language: 'python',
        bugType: 'Indentation Error',
        difficulty: 'Easy',
        description: 'This function should return the square of a number but throws an error.',
        brokenCode: `def square(x):
result = x * x
return result
print(square(4))`,
        hint: 'Python uses indentation to define code blocks.',
        solution: `def square(x):
    result = x * x
    return result
print(square(4))`,
        expectedOutput: '16'
    },
    {
        id: 'py-easy-2',
        title: 'The Wrong Operator',
        language: 'python',
        bugType: 'Operator Error',
        difficulty: 'Easy',
        description: 'This should check if a number is even but always returns True.',
        brokenCode: `def is_even(n):
    return n % 2 = 0
print(is_even(3))`,
        hint: 'Comparison vs assignment: `=` vs `==`.',
        solution: `def is_even(n):
    return n % 2 == 0
print(is_even(3))`,
        expectedOutput: 'False'
    },
    {
        id: 'py-easy-3',
        title: 'The List Index',
        language: 'python',
        bugType: 'Index Error',
        difficulty: 'Easy',
        description: 'This should print the third element but crashes.',
        brokenCode: `fruits = ["apple", "banana", "cherry"]
print(fruits[3])`,
        hint: 'Lists are 0-indexed. What is the valid range for a 3-element list?',
        solution: `fruits = ["apple", "banana", "cherry"]
print(fruits[2])`,
        expectedOutput: 'cherry'
    },
    {
        id: 'py-easy-4',
        title: 'The Mutable Default',
        language: 'python',
        bugType: 'Mutable Default Argument',
        difficulty: 'Easy',
        description: 'Each call should return a fresh list with one item, but the list keeps growing.',
        brokenCode: `def add_item(item, lst=[]):
    lst.append(item)
    return lst

print(add_item("a"))
print(add_item("b"))`,
        hint: 'Default mutable arguments in Python are shared across calls.',
        solution: `def add_item(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst

print(add_item("a"))
print(add_item("b"))`,
        expectedOutput: "['a']"
    },
    {
        id: 'py-easy-5',
        title: 'The String Integer',
        language: 'python',
        bugType: 'Type Error',
        difficulty: 'Easy',
        description: 'This should multiply user input by 2 but concatenates instead.',
        brokenCode: `num = "5"
result = num * 2
print(result)`,
        hint: 'What type is `num`? What does `*` do with strings?',
        solution: `num = "5"
result = int(num) * 2
print(result)`,
        expectedOutput: '10'
    },

    // ═══ PYTHON — MEDIUM ═══
    {
        id: 'py-med-1',
        title: 'The Silent Exception',
        language: 'python',
        bugType: 'Exception Handling',
        difficulty: 'Medium',
        description: 'This should handle division by zero but silently swallows all errors.',
        brokenCode: `def safe_divide(a, b):
    try:
        return a / b
    except:
        pass

print(safe_divide(10, 0))`,
        hint: 'Bare `except` catches everything. What should you actually return on error?',
        solution: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Error: Division by zero"

print(safe_divide(10, 0))`,
        expectedOutput: 'Error: Division by zero'
    },
    {
        id: 'py-med-2',
        title: 'The Range Mystery',
        language: 'python',
        bugType: 'Off-by-One Error',
        difficulty: 'Medium',
        description: 'This should print numbers 1 through 5 but stops at 4.',
        brokenCode: `for i in range(1, 5):
    print(i)`,
        hint: '`range(start, end)` — is `end` inclusive or exclusive?',
        solution: `for i in range(1, 6):
    print(i)`,
        expectedOutput: '1'
    },
    {
        id: 'py-med-3',
        title: 'The Dictionary Crash',
        language: 'python',
        bugType: 'KeyError',
        difficulty: 'Medium',
        description: 'This should safely get a value from a dictionary but crashes on missing keys.',
        brokenCode: `user = {"name": "Raj", "age": 20}
print(user["email"])`,
        hint: 'Use `.get()` for safe dictionary access with a default value.',
        solution: `user = {"name": "Raj", "age": 20}
print(user.get("email", "Not found"))`,
        expectedOutput: 'Not found'
    },
    {
        id: 'py-med-4',
        title: 'The Global Trap',
        language: 'python',
        bugType: 'Scope Error',
        difficulty: 'Medium',
        description: 'This counter should increment but throws an error.',
        brokenCode: `count = 0

def increment():
    count += 1
    return count

print(increment())`,
        hint: 'How does Python handle variable scope? What keyword lets you modify a global?',
        solution: `count = 0

def increment():
    global count
    count += 1
    return count

print(increment())`,
        expectedOutput: '1'
    },
    {
        id: 'py-med-5',
        title: 'The Shallow Copy',
        language: 'python',
        bugType: 'Reference vs Value',
        difficulty: 'Medium',
        description: 'Modifying the copy changes the original nested list.',
        brokenCode: `import copy
original = [[1, 2], [3, 4]]
shallow = copy.copy(original)
shallow[0].append(99)
print(original[0])`,
        hint: 'Shallow copy only copies the top level. What about nested objects?',
        solution: `import copy
original = [[1, 2], [3, 4]]
deep = copy.deepcopy(original)
deep[0].append(99)
print(original[0])`,
        expectedOutput: '[1, 2]'
    },

    // ═══ HARD CHALLENGES ═══
    {
        id: 'js-hard-1',
        title: 'The Promise Leak',
        language: 'javascript',
        bugType: 'Async/Await Error',
        difficulty: 'Hard',
        description: 'This async function should return fetched data but returns a pending Promise.',
        brokenCode: `function getData() {
  const result = fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(res => res.json());
  return result;
}
const data = getData();
console.log(typeof data);`,
        hint: 'The function returns before the Promise resolves. How do you wait for async operations?',
        solution: `async function getData() {
  const result = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(res => res.json());
  return result;
}
getData().then(data => console.log(typeof data));`,
        expectedOutput: 'object'
    },
    {
        id: 'js-hard-2',
        title: 'The This Context',
        language: 'javascript',
        bugType: 'Context Binding',
        difficulty: 'Hard',
        description: 'The button handler loses `this` context, printing undefined.',
        brokenCode: `const counter = {
  count: 0,
  increment: function() {
    this.count++;
    return this.count;
  }
};

const fn = counter.increment;
console.log(fn());`,
        hint: 'When you extract a method from an object, what happens to `this`?',
        solution: `const counter = {
  count: 0,
  increment: function() {
    this.count++;
    return this.count;
  }
};

const fn = counter.increment.bind(counter);
console.log(fn());`,
        expectedOutput: '1'
    },
    {
        id: 'py-hard-1',
        title: 'The Generator Gotcha',
        language: 'python',
        bugType: 'Generator Exhaustion',
        difficulty: 'Hard',
        description: 'The second loop over the generator prints nothing.',
        brokenCode: `def squares(n):
    for i in range(n):
        yield i * i

gen = squares(5)
first_pass = list(gen)
second_pass = list(gen)
print(len(second_pass))`,
        hint: 'Generators can only be iterated once. How do you re-create it?',
        solution: `def squares(n):
    for i in range(n):
        yield i * i

first_pass = list(squares(5))
second_pass = list(squares(5))
print(len(second_pass))`,
        expectedOutput: '5'
    },
    {
        id: 'py-hard-2',
        title: 'The Decorator Bug',
        language: 'python',
        bugType: 'Decorator Error',
        difficulty: 'Hard',
        description: 'This decorator should time a function but the original function name is lost.',
        brokenCode: `import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end-start:.4f}s")
        return result
    return wrapper

@timer
def slow_add(a, b):
    """Adds two numbers slowly."""
    return a + b

print(slow_add.__name__)`,
        hint: 'The wrapper replaces the original function metadata. Use `functools.wraps`.',
        solution: `import time
import functools

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end-start:.4f}s")
        return result
    return wrapper

@timer
def slow_add(a, b):
    """Adds two numbers slowly."""
    return a + b

print(slow_add.__name__)`,
        expectedOutput: 'slow_add'
    },
];

/**
 * Get a random challenge, optionally filtered by difficulty or language.
 */
export function getRandomChallenge(
    filters?: { language?: 'javascript' | 'python'; difficulty?: 'Easy' | 'Medium' | 'Hard' }
): BrokenCodeChallenge {
    let pool = [...BROKEN_CODE_CHALLENGES];

    if (filters?.language) {
        pool = pool.filter(c => c.language === filters.language);
    }
    if (filters?.difficulty) {
        pool = pool.filter(c => c.difficulty === filters.difficulty);
    }

    if (pool.length === 0) pool = [...BROKEN_CODE_CHALLENGES];

    return pool[Math.floor(Math.random() * pool.length)];
}
