'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import {
  FiArrowLeft, FiLock, FiCheckCircle,
  FiBook, FiVideo, FiSend, FiZap,
  FiChevronRight, FiAward, FiMessageSquare, FiArrowRight
} from 'react-icons/fi';

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Block =
  | { t: 'h2'; v: string }
  | { t: 'h3'; v: string }
  | { t: 'p'; v: string }
  | { t: 'ul'; v: string[] }
  | { t: 'code'; lang: string; v: string }
  | { t: 'tip'; v: string };

interface Topic {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  emoji: string;
  keyPoints: string[];
  blocks: Block[];
  videoUrl?: string;
  challengeQ: string;
}

interface Chapter {
  id: string;
  title: string;
  topics: Topic[];
}

// ─── CURRICULUM ───────────────────────────────────────────────────────────────
const FRONTEND_COURSE: { title: string; chapters: Chapter[] } = {
  title: 'Frontend Engineering',
  chapters: [
    {
      id: 'ch1',
      title: 'Chapter 1 — HTML & CSS',
      topics: [
        {
          id: 't1', title: 'Semantic HTML', subtitle: 'Structure that means something',
          duration: '15 min', emoji: '🏗️',
          keyPoints: [
            'header, main, section, article vs div',
            'Accessibility — screen readers rely on semantics',
            'SEO crawlers read semantic structure',
            'ARIA roles complement (but do not replace) semantics',
          ],
          videoUrl: 'https://www.youtube.com/embed/kGW8Al_cga4',
          challengeQ: 'What is the difference between section and article? Give a real-world example of when you would use each.',
          blocks: [
            { t: 'h2', v: 'What is Semantic HTML?' },
            { t: 'p', v: 'Semantic HTML means using elements that describe the meaning of your content, not just its appearance.' },
            { t: 'h3', v: 'Why it matters' },
            { t: 'ul', v: [
              'Accessibility: screen readers use nav, main, button to help visually impaired users navigate',
              'SEO: search engines rank pages higher when they understand the content structure',
              'Maintainability: other developers understand your code faster',
            ]},
            { t: 'h3', v: 'Common Semantic Elements' },
            { t: 'ul', v: [
              'header — introductory content, nav links',
              'main — central content (only 1 per page)',
              'section — thematic grouping',
              'article — self-contained content (blog post, card)',
              'aside — tangentially related content',
              'footer — closing info, links',
            ]},
            { t: 'h3', v: 'Rule of Thumb' },
            { t: 'p', v: 'If you use div for everything, you are almost certainly missing semantic HTML opportunities.' },
          ],
        },
        {
          id: 't2', title: 'Flexbox Layout', subtitle: 'One-dimensional layouts mastered',
          duration: '20 min', emoji: '📦',
          keyPoints: [
            'display: flex turns parent into a flex container',
            'justify-content aligns on the main axis',
            'align-items aligns on the cross axis',
            'flex-wrap, gap, flex-grow for responsive layouts',
          ],
          videoUrl: 'https://www.youtube.com/embed/phWxA89Dy94',
          challengeQ: 'Without looking it up: what does align-items: center do vs justify-content: center? Which axis does each affect?',
          blocks: [
            { t: 'h2', v: 'Flexbox in 5 Minutes' },
            { t: 'p', v: 'Flexbox handles one-dimensional layouts — either a row or a column.' },
            { t: 'h3', v: 'Key Properties on the Parent (container)' },
            { t: 'code', lang: 'css', v: '.container {\n  display: flex;\n  flex-direction: row;      /* or column */\n  justify-content: center;  /* main axis */\n  align-items: center;      /* cross axis */\n  gap: 16px;\n  flex-wrap: wrap;\n}' },
            { t: 'h3', v: 'Key Properties on Children' },
            { t: 'code', lang: 'css', v: '.child {\n  flex: 1;              /* grow to fill space equally */\n  flex-shrink: 0;       /* do not shrink below content size */\n  align-self: flex-end; /* override parent align-items */\n}' },
            { t: 'h3', v: 'Mental Model' },
            { t: 'p', v: 'Think of flexbox as a conveyor belt. The belt goes in one direction (row or column), and you control where items sit on that belt.' },
            { t: 'tip', v: 'Use Flexbox for 1D layouts (navigation bars, centering, rows). Use CSS Grid for 2D layouts (page structure, card grids).' },
          ],
        },
        {
          id: 't3', title: 'CSS Grid', subtitle: 'Two-dimensional layout system',
          duration: '20 min', emoji: '⚡',
          keyPoints: [
            'Grid handles rows AND columns simultaneously',
            'grid-template-columns: repeat(3, 1fr)',
            'grid-column: span 2 for merging cells',
            'Grid areas for named template zones',
          ],
          videoUrl: 'https://www.youtube.com/embed/EiNiSFIPIQE',
          challengeQ: 'When would you use CSS Grid instead of Flexbox? Name one layout that is much easier to build with Grid.',
          blocks: [
            { t: 'h2', v: 'CSS Grid — The Layout Powerhouse' },
            { t: 'p', v: 'While Flexbox is 1D, Grid is 2D — it handles both rows and columns at the same time.' },
            { t: 'h3', v: 'Basic Setup' },
            { t: 'code', lang: 'css', v: '.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}' },
            { t: 'h3', v: 'Named Template Areas' },
            { t: 'code', lang: 'css', v: '.layout {\n  display: grid;\n  grid-template-areas:\n    "header header header"\n    "sidebar main main"\n    "footer footer footer";\n}\n.header  { grid-area: header; }\n.sidebar { grid-area: sidebar; }' },
            { t: 'h3', v: 'Grid vs Flexbox — When to use which' },
            { t: 'ul', v: [
              'Grid: page-level layout, card grids, complex 2D arrangements',
              'Flexbox: navigation bars, single-row content, centering items',
            ]},
          ],
        },
      ],
    },
    {
      id: 'ch2',
      title: 'Chapter 2 — JavaScript Core',
      topics: [
        {
          id: 't4', title: 'Closures & Scope', subtitle: 'The heart of JavaScript',
          duration: '25 min', emoji: '🔐',
          keyPoints: [
            'Functions remember their outer scope (closure)',
            'Lexical scoping: scope set at definition, not call time',
            'Practical use: data privacy, factory functions, memoization',
            'Common pitfall: var in loops vs let',
          ],
          videoUrl: 'https://www.youtube.com/embed/3a0I8ICR1Vg',
          challengeQ: 'Explain in your own words: what is a closure? Write a simple function that uses a closure to create a counter that starts at any number.',
          blocks: [
            { t: 'h2', v: 'Closures — JavaScript\'s Secret Weapon' },
            { t: 'p', v: 'A closure is when a function remembers variables from its outer scope, even after the outer function has returned.' },
            { t: 'h3', v: 'Simple Example' },
            { t: 'code', lang: 'javascript', v: 'function makeCounter() {\n  let count = 0; // this is "enclosed"\n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = makeCounter();\ncounter(); // 1\ncounter(); // 2\ncounter(); // 3' },
            { t: 'h3', v: 'Why Closures Matter' },
            { t: 'ul', v: [
              'Data Privacy — hide variables from global scope',
              'Factory Functions — create customized functions on the fly',
              'Memoization — cache expensive computation results',
              'Event Handlers — remember state without global variables',
            ]},
            { t: 'h3', v: 'The Loop Pitfall (var vs let)' },
            { t: 'code', lang: 'javascript', v: '// Bug: all handlers log 3 (var is function-scoped)\nfor (var i = 0; i < 3; i++) {\n  btn[i].onclick = () => console.log(i);\n}\n\n// Fix: let is block-scoped, each iteration gets its own i\nfor (let i = 0; i < 3; i++) {\n  btn[i].onclick = () => console.log(i);\n}' },
          ],
        },
        {
          id: 't5', title: 'Async/Await & Promises', subtitle: 'Taming asynchronous code',
          duration: '30 min', emoji: '⏳',
          keyPoints: [
            'Promises represent a future value (pending/resolved/rejected)',
            'async functions always return a Promise',
            'await pauses until the promise resolves',
            'Error handling with try/catch in async functions',
          ],
          videoUrl: 'https://www.youtube.com/embed/V_Kr9OSfDeU',
          challengeQ: 'What is the difference between sequential await and Promise.all? When would you choose one over the other?',
          blocks: [
            { t: 'h2', v: 'Async/Await — Making Async Code Readable' },
            { t: 'h3', v: 'The Problem: Callback Hell' },
            { t: 'code', lang: 'javascript', v: '// Callback hell — hard to read and debug\ngetUser(id, (user) => {\n  getPosts(user.id, (posts) => {\n    getComments(posts[0].id, (comments) => {\n      // pyramid of doom continues...\n    });\n  });\n});' },
            { t: 'h3', v: 'The Solution: async/await' },
            { t: 'code', lang: 'javascript', v: 'async function loadUserData(id) {\n  try {\n    const user     = await getUser(id);\n    const posts    = await getPosts(user.id);\n    const comments = await getComments(posts[0].id);\n    return { user, posts, comments };\n  } catch (error) {\n    console.error(\'Failed:\', error);\n  }\n}' },
            { t: 'h3', v: 'Parallel Fetching with Promise.all (faster!)' },
            { t: 'code', lang: 'javascript', v: '// Sequential — slow, waits one by one\nconst user     = await getUser(id);\nconst settings = await getSettings(id);\n\n// Parallel — both fire at the same time\nconst [user, settings] = await Promise.all([\n  getUser(id),\n  getSettings(id)\n]);' },
            { t: 'tip', v: 'Use Promise.all when the calls are independent of each other. Use sequential await when one call depends on the result of a previous one.' },
          ],
        },
      ],
    },
    {
      id: 'ch3',
      title: 'Chapter 3 — React & Next.js',
      topics: [
        {
          id: 't6', title: 'React Hooks Deep Dive', subtitle: 'useState, useEffect, useRef',
          duration: '35 min', emoji: '🪝',
          keyPoints: [
            'Hooks must be called at the top level — never in loops or conditions',
            'useState triggers a re-render on change',
            'useEffect manages side effects with an optional cleanup',
            'useRef gives a mutable ref without causing re-renders',
          ],
          videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q',
          challengeQ: 'Why can\'t you call a Hook inside an if statement? What would go wrong at runtime?',
          blocks: [
            { t: 'h2', v: 'React Hooks — Complete Guide' },
            { t: 'h3', v: 'useState' },
            { t: 'code', lang: 'jsx', v: 'const [count, setCount] = useState(0);\n\n// Direct update\nsetCount(count + 1);\n\n// Safe functional update (use this to avoid stale closures)\nsetCount(prev => prev + 1);' },
            { t: 'h3', v: 'useEffect' },
            { t: 'code', lang: 'jsx', v: 'useEffect(() => {\n  // Runs after every render (or when deps change)\n  document.title = "Count: " + count;\n\n  return () => {\n    // Cleanup: runs before next effect or on unmount\n  };\n}, [count]); // Only re-run when count changes' },
            { t: 'h3', v: 'useRef' },
            { t: 'code', lang: 'jsx', v: '// 1. Access a DOM element\nconst inputRef = useRef(null);\n// <input ref={inputRef} />\ninputRef.current.focus();\n\n// 2. Persist a value without triggering re-render\nconst prevCount = useRef(count);\nuseEffect(() => { prevCount.current = count; });' },
            { t: 'h3', v: 'The Rules of Hooks' },
            { t: 'ul', v: [
              'Only call hooks at the TOP LEVEL of your component',
              'Only call hooks from React function components',
              'Never call hooks inside if/else, loops, or nested functions',
            ]},
            { t: 'tip', v: 'The Rules of Hooks exist because React tracks hook order. If you conditionally skip a hook, the order shifts and all subsequent hooks read the wrong state.' },
          ],
        },
      ],
    },
  ],
};

const CLOUD_DEVOPS_COURSE: typeof FRONTEND_COURSE = {
  title: 'Cloud & DevOps',
  chapters: [
    {
      id: 'ch1',
      title: 'Chapter 1 — Linux & Shell',
      topics: [
        {
          id: 'cd1', title: 'Linux Fundamentals', subtitle: 'The foundation of every server',
          duration: '20 min', emoji: '🐧',
          keyPoints: [
            'Filesystem hierarchy: /, /etc, /var, /home, /usr',
            'File operations: ls, cp, mv, rm, find',
            'Permissions: chmod, chown, rwx model',
            'Process management: ps, kill, top, systemctl',
          ],
          videoUrl: 'https://www.youtube.com/embed/ZtqBQ68cfJc',
          challengeQ: 'What does chmod 755 mean? Break down each digit and explain who can do what.',
          blocks: [
            { t: 'h2', v: 'Linux — The Language of Servers' },
            { t: 'p', v: '90%+ of cloud infrastructure runs Linux. Understanding it is non-negotiable for any DevOps engineer.' },
            { t: 'h3', v: 'Essential File Commands' },
            { t: 'code', lang: 'bash', v: 'ls -la          # list all files with permissions\ncp src dst      # copy file\nmv src dst      # move / rename\nrm -rf dir/     # delete directory (careful!)\nfind / -name "*.log"  # find files by name' },
            { t: 'h3', v: 'File Permissions (rwx)' },
            { t: 'code', lang: 'bash', v: '# chmod 755 filename\n# 7 = rwx (owner)  5 = r-x (group)  5 = r-x (others)\nchmod +x script.sh   # make executable\nchown user:group file # change owner' },
            { t: 'h3', v: 'Process Management' },
            { t: 'code', lang: 'bash', v: 'ps aux           # list all processes\nkill -9 <PID>    # force kill\ntop              # live process viewer\nsystemctl start nginx   # manage services' },
            { t: 'tip', v: 'Learn the filesystem hierarchy. Knowing that configs live in /etc, logs in /var/log, and user binaries in /usr/bin saves hours of debugging.' },
          ],
        },
        {
          id: 'cd2', title: 'Bash Scripting', subtitle: 'Automate everything',
          duration: '25 min', emoji: '📜',
          keyPoints: [
            'Variables, loops, and conditionals in bash',
            'Exit codes and error handling with set -e',
            'Functions and script arguments ($1, $@)',
            'Cron jobs for scheduled automation',
          ],
          videoUrl: 'https://www.youtube.com/embed/tK9Oc6AEnR4',
          challengeQ: 'Write a bash script that checks if a file exists and prints "Found" or "Not found" accordingly.',
          blocks: [
            { t: 'h2', v: 'Bash Scripting — Automation at the Shell Level' },
            { t: 'h3', v: 'Script Basics' },
            { t: 'code', lang: 'bash', v: '#!/bin/bash\nset -e  # exit on any error\n\nNAME="World"\necho "Hello, $NAME!"\n\n# Arguments\necho "First arg: $1"' },
            { t: 'h3', v: 'Conditionals & Loops' },
            { t: 'code', lang: 'bash', v: 'if [ -f "/etc/hosts" ]; then\n  echo "Hosts file exists"\nfi\n\nfor i in 1 2 3; do\n  echo "Count: $i"\ndone' },
            { t: 'h3', v: 'Functions' },
            { t: 'code', lang: 'bash', v: 'deploy() {\n  echo "Deploying $1..."\n  git pull && npm run build\n}\n\ndeploy "production"' },
          ],
        },
      ],
    },
    {
      id: 'ch2',
      title: 'Chapter 2 — Docker & Containers',
      topics: [
        {
          id: 'cd3', title: 'Docker Fundamentals', subtitle: 'Build once, run anywhere',
          duration: '30 min', emoji: '🐳',
          keyPoints: [
            'Container vs VM: what is the difference',
            'Dockerfile: FROM, RUN, COPY, CMD',
            'docker build, docker run, docker ps',
            'Port mapping and volume mounts',
          ],
          videoUrl: 'https://www.youtube.com/embed/pg19Z8LL06w',
          challengeQ: 'What is the difference between CMD and ENTRYPOINT in a Dockerfile? When would you use each?',
          blocks: [
            { t: 'h2', v: 'Docker — Containerise Everything' },
            { t: 'p', v: 'Docker packages your app with its dependencies into a portable container that runs consistently everywhere.' },
            { t: 'h3', v: 'A Real Dockerfile' },
            { t: 'code', lang: 'dockerfile', v: 'FROM node:20-alpine\n\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\n\nEXPOSE 3000\nCMD ["node", "server.js"]' },
            { t: 'h3', v: 'Essential Docker Commands' },
            { t: 'code', lang: 'bash', v: 'docker build -t myapp:latest .\ndocker run -p 3000:3000 myapp:latest\ndocker ps              # running containers\ndocker logs <id>       # view logs\ndocker exec -it <id> sh # shell into container' },
            { t: 'tip', v: 'Use multi-stage builds to keep your final image small. Build in one stage, copy only the artifacts to the final stage.' },
          ],
        },
        {
          id: 'cd4', title: 'Docker Compose', subtitle: 'Orchestrate multi-container apps',
          duration: '25 min', emoji: '🎼',
          keyPoints: [
            'docker-compose.yml defines services, networks, volumes',
            'depends_on controls startup order',
            'Environment variables with .env files',
            'Named volumes for persistent data',
          ],
          videoUrl: 'https://www.youtube.com/embed/DM65_JyGxCo',
          challengeQ: 'Write a docker-compose.yml that runs a Node.js app connected to a PostgreSQL database.',
          blocks: [
            { t: 'h2', v: 'Docker Compose — Multi-Service Apps' },
            { t: 'h3', v: 'Example: Node + Postgres Stack' },
            { t: 'code', lang: 'yaml', v: 'version: "3.9"\nservices:\n  app:\n    build: .\n    ports: ["3000:3000"]\n    environment:\n      DB_URL: postgres://user:pass@db:5432/mydb\n    depends_on: [db]\n\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_PASSWORD: pass\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n\nvolumes:\n  pgdata:' },
            { t: 'h3', v: 'Useful Commands' },
            { t: 'code', lang: 'bash', v: 'docker compose up -d     # start in background\ndocker compose down      # stop + remove containers\ndocker compose logs -f   # follow logs' },
          ],
        },
      ],
    },
    {
      id: 'ch3',
      title: 'Chapter 3 — CI/CD & Cloud',
      topics: [
        {
          id: 'cd5', title: 'GitHub Actions CI/CD', subtitle: 'Automate your pipeline',
          duration: '35 min', emoji: '⚙️',
          keyPoints: [
            'Workflow YAML: on, jobs, steps',
            'Triggers: push, pull_request, schedule',
            'Secrets and environment variables in Actions',
            'Deploy to cloud on every merge to main',
          ],
          videoUrl: 'https://www.youtube.com/embed/R8_veQiYBjI',
          challengeQ: 'Design a CI/CD pipeline that runs tests on every PR and deploys to production only when merged to main.',
          blocks: [
            { t: 'h2', v: 'GitHub Actions — Automate Your Workflow' },
            { t: 'h3', v: 'A Complete CI/CD Pipeline' },
            { t: 'code', lang: 'yaml', v: 'name: CI/CD Pipeline\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 20 }\n      - run: npm ci\n      - run: npm test\n\n  deploy:\n    needs: test\n    if: github.ref == \'refs/heads/main\'\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo "Deploy to production..."' },
            { t: 'tip', v: 'Always store secrets in GitHub repository secrets — never hardcode API keys or passwords in workflow files.' },
          ],
        },
        {
          id: 'cd6', title: 'Cloud Fundamentals (AWS/GCP)', subtitle: 'Infrastructure at scale',
          duration: '40 min', emoji: '☁️',
          keyPoints: [
            'Compute: EC2 / Cloud Run — run your containers',
            'Storage: S3 / GCS — object storage for files',
            'Managed DB: RDS / Cloud SQL',
            'IaC: what is Terraform and why it matters',
          ],
          videoUrl: 'https://www.youtube.com/embed/M988_fsOSWo',
          challengeQ: 'What is the difference between horizontal and vertical scaling? Give a scenario where you would choose each.',
          blocks: [
            { t: 'h2', v: 'Cloud 101 — The Big Picture' },
            { t: 'p', v: 'Cloud providers (AWS, GCP, Azure) let you rent compute, storage, and managed services instead of buying hardware.' },
            { t: 'h3', v: 'Core Service Categories' },
            { t: 'ul', v: [
              'Compute — EC2 instances, Cloud Run, Lambda (serverless)',
              'Storage — S3 / GCS buckets for files, CDN for static assets',
              'Database — RDS (managed Postgres/MySQL), DynamoDB (NoSQL)',
              'Networking — VPC, Load Balancers, Route 53 (DNS)',
            ]},
            { t: 'h3', v: 'Infrastructure as Code with Terraform' },
            { t: 'code', lang: 'hcl', v: 'resource "aws_instance" "web" {\n  ami           = "ami-0c55b159cbfafe1f0"\n  instance_type = "t3.micro"\n\n  tags = {\n    Name = "web-server"\n  }\n}' },
            { t: 'tip', v: 'Always use Infrastructure as Code. Never click-configure production servers — you cannot version-control mouse clicks.' },
          ],
        },
      ],
    },
  ],
};

const FULLSTACK_COURSE: typeof FRONTEND_COURSE = {
  title: 'Full Stack Engineering',
  chapters: [
    {
      id: 'ch1',
      title: 'Chapter 1 — Foundation',
      topics: [
        {
          id: 'fs1', title: 'REST API Design', subtitle: 'Building clean, predictable APIs',
          duration: '25 min', emoji: '🔌',
          keyPoints: ['Resources & HTTP verbs', 'Status codes that mean something', 'Pagination & filtering', 'Versioning strategies'],
          videoUrl: 'https://www.youtube.com/embed/lsMQRaeKNDk',
          challengeQ: 'Design the REST API endpoints for a blog platform with posts, comments, and users.',
          blocks: [
            { t: 'h2', v: 'REST API Design Principles' },
            { t: 'p', v: 'A well-designed REST API is predictable, consistent, and easy to consume — even without documentation.' },
            { t: 'h3', v: 'HTTP Verbs & Resources' },
            { t: 'ul', v: ['GET /posts — list all posts', 'POST /posts — create a new post', 'GET /posts/:id — get single post', 'PUT /posts/:id — update post', 'DELETE /posts/:id — delete post'] },
            { t: 'tip', v: 'Always version your API: /api/v1/... This lets you introduce breaking changes without breaking existing clients.' },
          ],
        },
      ],
    },
  ],
};

const DATA_SCIENCE_COURSE: typeof FRONTEND_COURSE = {
  title: 'Data Science & ML',
  chapters: [
    {
      id: 'ch1',
      title: 'Chapter 1 — Python for Data',
      topics: [
        {
          id: 'ds1', title: 'Python & NumPy', subtitle: 'The data science stack',
          duration: '30 min', emoji: '🐍',
          keyPoints: ['NumPy arrays vs Python lists', 'Broadcasting & vectorization', 'Pandas DataFrames', 'Data cleaning patterns'],
          videoUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI',
          challengeQ: 'What is broadcasting in NumPy and why is it faster than using a Python loop?',
          blocks: [
            { t: 'h2', v: 'Python Data Stack Essentials' },
            { t: 'p', v: 'NumPy and Pandas are the bedrock of data science in Python.' },
            { t: 'h3', v: 'NumPy Basics' },
            { t: 'code', lang: 'python', v: 'import numpy as np\n\na = np.array([1, 2, 3, 4, 5])\nprint(a * 2)      # [2 4 6 8 10] — no loop needed!\nprint(a.mean())   # 3.0\nprint(a.std())    # standard deviation' },
            { t: 'tip', v: 'Vectorize everything. A NumPy operation on 1M elements is ~100x faster than an equivalent Python loop.' },
          ],
        },
      ],
    },
  ],
};

const MOBILE_DEV_COURSE: typeof FRONTEND_COURSE = {
  title: 'Mobile Development',
  chapters: [
    {
      id: 'ch1',
      title: 'Chapter 1 — React Native',
      topics: [
        {
          id: 'mb1', title: 'React Native Basics', subtitle: 'One codebase, two platforms',
          duration: '30 min', emoji: '📱',
          keyPoints: ['Native components vs web DOM elements', 'StyleSheet vs CSS', 'Flexbox is the default layout', 'Navigation with Expo Router'],
          videoUrl: 'https://www.youtube.com/embed/0-S5a0eXPoc',
          challengeQ: 'What is the difference between View and div? Why can you not use CSS classes in React Native?',
          blocks: [
            { t: 'h2', v: 'React Native — Build for iOS & Android' },
            { t: 'p', v: 'React Native lets you write JavaScript that compiles to truly native UI components — not a web view.' },
            { t: 'h3', v: 'Core Components' },
            { t: 'ul', v: ['View (like div)', 'Text (all text must be wrapped)', 'Image (src becomes source)', 'TextInput (like input)', 'TouchableOpacity (click handler)'] },
            { t: 'tip', v: 'Think of React Native as React with a different rendering target. The component model and hooks work exactly the same.' },
          ],
        },
      ],
    },
  ],
};

const BACKEND_COURSE: typeof FRONTEND_COURSE = {
  title: 'Backend Engineering',
  chapters: [
    {
      id: 'ch1',
      title: 'Chapter 1 — Server Fundamentals',
      topics: [
        {
          id: 'be1', title: 'Node.js & Express', subtitle: 'Server-side JavaScript',
          duration: '25 min', emoji: '🖥️',
          keyPoints: ['Event loop — why Node is non-blocking', 'Express middleware chain', 'Route parameters & query strings', 'Error handling middleware'],
          videoUrl: 'https://www.youtube.com/embed/ENrzD9HAZK4',
          challengeQ: 'Explain how the Node.js event loop allows it to handle thousands of concurrent connections on a single thread.',
          blocks: [
            { t: 'h2', v: 'Node.js & Express — Server Essentials' },
            { t: 'h3', v: 'Hello World in Express' },
            { t: 'code', lang: 'javascript', v: 'const express = require(\'express\');\nconst app = express();\n\napp.use(express.json());\n\napp.get(\'/api/users\', async (req, res) => {\n  const users = await db.query(\'SELECT * FROM users\');\n  res.json(users);\n});\n\napp.listen(3000, () => console.log(\'Server on port 3000\'));' },
            { t: 'tip', v: 'Always add error handling middleware last. In Express, a 4-argument function (err, req, res, next) is treated as an error handler.' },
          ],
        },
      ],
    },
  ],
};

const COURSES: Record<string, typeof FRONTEND_COURSE> = {
  'frontend-basics': FRONTEND_COURSE,
  'cloud-devops': CLOUD_DEVOPS_COURSE,
  'fullstack': FULLSTACK_COURSE,
  'data-science': DATA_SCIENCE_COURSE,
  'mobile-dev': MOBILE_DEV_COURSE,
  'backend': BACKEND_COURSE,
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  bg: '#0F0F14', panel: '#16161E', card: '#1E1E2A',
  border: 'rgba(255,255,255,0.08)', accent: '#7C3AED',
  accentGlow: 'rgba(124,58,237,0.25)', green: '#10B981',
  text: '#E8E8F0', sub: '#888899', muted: '#555566',
};

// ─── RENDER BLOCKS ───────────────────────────────────────────────────────────
function RenderBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {blocks.map((b, i) => {
        if (b.t === 'h2') return <h2 key={i} style={{ fontSize: 20, fontWeight: 900, color: S.text, margin: '16px 0 4px', letterSpacing: '-0.02em' }}>{b.v}</h2>;
        if (b.t === 'h3') return <h3 key={i} style={{ fontSize: 14, fontWeight: 800, color: '#C4B5FD', margin: '12px 0 2px' }}>{b.v}</h3>;
        if (b.t === 'p')  return <p  key={i} style={{ fontSize: 14, color: S.sub, lineHeight: 1.75, margin: 0 }}>{b.v}</p>;
        if (b.t === 'ul') return (
          <ul key={i} style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {b.v.map((item, j) => <li key={j} style={{ fontSize: 13, color: S.sub, lineHeight: 1.6 }}>{item}</li>)}
          </ul>
        );
        if (b.t === 'code') return (
          <div key={i} style={{ background: '#0A0A10', border: `1px solid ${S.border}`, borderRadius: 12, overflow: 'hidden', margin: '4px 0' }}>
            <div style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.04)', borderBottom: `1px solid ${S.border}`, fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: S.muted }}>{b.lang}</div>
            <pre style={{ margin: 0, padding: '16px', fontSize: 12, color: '#A78BFA', overflowX: 'auto', lineHeight: 1.65, fontFamily: 'JetBrains Mono, Consolas, monospace' }}>{b.v}</pre>
          </div>
        );
        if (b.t === 'tip') return (
          <div key={i} style={{ padding: '12px 16px', background: 'rgba(124,58,237,0.1)', border: `1px solid rgba(124,58,237,0.3)`, borderRadius: 10, fontSize: 13, color: '#C4B5FD', lineHeight: 1.6 }}>
            💡 <strong>Tip:</strong> {b.v}
          </div>
        );
        return null;
      })}
    </div>
  );
}

// ─── TOPIC NODE ──────────────────────────────────────────────────────────────
function TopicNode({ topic, status, isActive, onClick }: {
  topic: Topic; status: 'completed' | 'current' | 'locked'; isActive: boolean; onClick: () => void;
}) {
  const locked = status === 'locked';
  const done   = status === 'completed';
  return (
    <motion.button onClick={locked ? undefined : onClick}
      whileHover={!locked ? { x: 3 } : {}} whileTap={!locked ? { scale: 0.97 } : {}}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 12, border: 'none', textAlign: 'left',
        cursor: locked ? 'not-allowed' : 'pointer', transition: 'all 0.18s',
        background: isActive ? 'rgba(124,58,237,0.15)' : done ? 'rgba(16,185,129,0.08)' : 'transparent',
        borderLeft: `3px solid ${isActive ? S.accent : done ? S.green : 'transparent'}`,
        opacity: locked ? 0.38 : 1,
      }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, fontSize: 16,
        background: done ? 'rgba(16,185,129,0.15)' : isActive ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)',
        border: `1.5px solid ${done ? 'rgba(16,185,129,0.4)' : isActive ? 'rgba(124,58,237,0.4)' : S.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {locked ? <FiLock size={13} color={S.muted} /> : done ? <FiCheckCircle size={14} color={S.green} /> : topic.emoji}
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: locked ? S.muted : S.text, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{topic.title}</div>
        <div style={{ fontSize: 11, color: S.muted }}>{topic.duration}</div>
      </div>
      {isActive && <FiChevronRight size={13} color={S.accent} style={{ flexShrink: 0 }} />}
    </motion.button>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function LearningPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const courseId = (params?.courseId as string) || 'frontend-basics';
  const courseNotFound = !!courseId && !COURSES[courseId];
  const course   = COURSES[courseId] || COURSES['frontend-basics'];
  const allTopics = course.chapters.flatMap(ch => ch.topics);

  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [activeTopic, setActiveTopic]   = useState<Topic | null>(null);
  const [activeTab, setActiveTab]       = useState<'notes' | 'video' | 'challenge'>('notes');
  const [messages, setMessages]         = useState([{ role: 'ai', content: "Hi! I'm your Doubt Bot. Select a topic and ask me anything about it — I'll guide you, not just give answers." }]);
  const [input, setInput]               = useState('');
  const [botLoading, setBotLoading]     = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Key includes userId so different accounts on the same browser never share progress
  const storageKey = `pp_learn_${user?.uid || 'guest'}_${courseId}`;

  useEffect(() => {
    // Reset when user changes to prevent bleed-over between accounts
    setCompletedIds(new Set());
    setActiveTopic(null);
    const saved = localStorage.getItem(storageKey);
    const ids = saved ? new Set<string>(JSON.parse(saved)) : new Set<string>();
    setCompletedIds(ids);
    const first = allTopics.find(t => !ids.has(t.id)) || allTopics[0];
    setActiveTopic(first || null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user?.uid]);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

  const getStatus = (topic: Topic, idx: number): 'completed' | 'current' | 'locked' => {
    if (completedIds.has(topic.id)) return 'completed';
    if (idx === 0 || completedIds.has(allTopics[idx - 1].id)) return 'current';
    return 'locked';
  };

  const markComplete = () => {
    if (!activeTopic) return;
    const updated = new Set(completedIds);
    updated.add(activeTopic.id);
    setCompletedIds(updated);
    localStorage.setItem(storageKey, JSON.stringify([...updated]));
    const idx = allTopics.findIndex(t => t.id === activeTopic.id);
    if (idx < allTopics.length - 1) { setActiveTopic(allTopics[idx + 1]); setActiveTab('notes'); }
  };

  const sendDoubt = async () => {
    if (!input.trim() || botLoading) return;
    const q = input.trim();
    setMessages(p => [...p, { role: 'user', content: q }]);
    setInput('');
    setBotLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: q }].map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })), personalityMode: 'TUTOR' })
      });
      const data = await res.json();
      setMessages(p => [...p, { role: 'ai', content: data.text || 'Try rephrasing your question!' }]);
    } catch {
      setMessages(p => [...p, { role: 'ai', content: 'Could not reach the AI. Check your connection.' }]);
    } finally { setBotLoading(false); }
  };

  const done  = completedIds.size;
  const total = allTopics.length;
  const pct   = Math.round((done / total) * 100);
  const ai    = activeTopic ? allTopics.findIndex(t => t.id === activeTopic.id) : -1;
  const astatus = activeTopic ? getStatus(activeTopic, ai) : 'locked';
  const canMark = !!activeTopic && astatus !== 'locked' && !completedIds.has(activeTopic.id);

  if (courseNotFound) {
    return (
      <div style={{ height: '100vh', background: S.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: S.text }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>🚀</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 10, letterSpacing: '-0.03em' }}>Course Coming Soon</h2>
          <p style={{ color: S.sub, fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            This learning path is being built by our curriculum team. Check back soon — we publish new paths regularly!
          </p>
          <button onClick={() => router.push('/dashboard')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 13, color: '#fff', boxShadow: '0 6px 22px rgba(124,58,237,0.35)' }}>
            <FiArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', background: S.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', color: S.text }}>

      {/* TOPBAR */}
      <header style={{ height: 56, background: S.panel, borderBottom: `1px solid ${S.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${S.border}`, borderRadius: 8, cursor: 'pointer', color: S.sub, fontSize: 12, fontWeight: 600 }}>
            <FiArrowLeft size={13} /> Dashboard
          </button>
          <div style={{ height: 18, width: 1, background: S.border }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: S.text }}>{course.title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? S.green : S.accent }}>{done}/{total} topics</span>
          <div style={{ width: 110, height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
            <motion.div animate={{ width: pct + '%' }} transition={{ duration: 0.5 }}
              style={{ height: '100%', background: pct === 100 ? S.green : 'linear-gradient(90deg,#7C3AED,#A855F7)', borderRadius: 999 }} />
          </div>
          {pct === 100 && <FiAward size={16} color={S.green} />}
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT — topic chain */}
        <aside style={{ width: 260, background: S.panel, borderRight: `1px solid ${S.border}`, overflowY: 'auto', flexShrink: 0, padding: '16px 10px' }}>
          {course.chapters.map((ch, chIdx) => {
            const start = course.chapters.slice(0, chIdx).reduce((a, c) => a + c.topics.length, 0);
            return (
              <div key={ch.id} style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: S.muted, padding: '0 6px 8px' }}>{ch.title}</div>
                {/* connector line behind nodes */}
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 29, top: 18, bottom: 18, width: 2, background: `linear-gradient(to bottom,rgba(124,58,237,0.35),${S.border})`, borderRadius: 1 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {ch.topics.map((topic, ti) => (
                      <TopicNode key={topic.id} topic={topic} status={getStatus(topic, start + ti)}
                        isActive={activeTopic?.id === topic.id}
                        onClick={() => { setActiveTopic(topic); setActiveTab('notes'); }} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          {pct === 100 && (
            <div style={{ margin: '4px', padding: '16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>🎉</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: S.green }}>Course Complete!</div>
            </div>
          )}
        </aside>

        {/* CENTER — content */}
        <main style={{ flex: 1, overflowY: 'auto', borderRight: `1px solid ${S.border}` }}>
          {activeTopic ? (
            <AnimatePresence mode="wait">
              <motion.div key={activeTopic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {/* Hero */}
                <div style={{ padding: '30px 36px 22px', borderBottom: `1px solid ${S.border}` }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{activeTopic.emoji}</div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: S.text, margin: '0 0 4px', letterSpacing: '-0.03em' }}>{activeTopic.title}</h2>
                  <p  style={{ fontSize: 13, color: S.sub, margin: '0 0 18px' }}>{activeTopic.subtitle} · {activeTopic.duration}</p>
                  {/* Key points */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {activeTopic.keyPoints.map((kp, i) => (
                      <div key={i} style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${S.border}`, borderRadius: 7, fontSize: 11, fontWeight: 600, color: S.sub, fontFamily: 'monospace' }}>{kp}</div>
                    ))}
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', background: S.panel, borderBottom: `1px solid ${S.border}`, padding: '0 36px' }}>
                  {([['notes','Notes','#book'], ['video','Video','#video'], ['challenge','Challenge','#zap']] as [string,string,string][]).map(([id, label]) => (
                    <button key={id} onClick={() => setActiveTab(id as any)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '13px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: activeTab === id ? S.accent : S.muted, borderBottom: `2px solid ${activeTab === id ? S.accent : 'transparent'}`, transition: 'all 0.15s', marginBottom: -1 }}>
                      {id === 'notes' && <FiBook size={12} />}
                      {id === 'video' && <FiVideo size={12} />}
                      {id === 'challenge' && <FiZap size={12} />}
                      {label}
                    </button>
                  ))}
                </div>

                {/* Tab body */}
                <div style={{ padding: '28px 36px' }}>
                  {activeTab === 'notes' && <RenderBlocks blocks={activeTopic.blocks} />}

                  {activeTab === 'video' && (
                    activeTopic.videoUrl ? (
                      <div>
                        <div style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${S.border}`, aspectRatio: '16/9', marginBottom: 18 }}>
                          <iframe src={activeTopic.videoUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen title={activeTopic.title} />
                        </div>
                        <div style={{ padding: '12px 16px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10, fontSize: 12, color: S.sub }}>
                          💡 Pause and take notes as you watch. Then use the Doubt Bot on the right to test your understanding.
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: 60, color: S.muted }}>🎬 Video coming soon</div>
                    )
                  )}

                  {activeTab === 'challenge' && (
                    <div>
                      <div style={{ padding: '20px 24px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 14, marginBottom: 20 }}>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: S.accent, marginBottom: 8 }}>Quick Challenge</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: S.text, lineHeight: 1.5 }}>{activeTopic.challengeQ}</div>
                      </div>
                      <div style={{ fontSize: 12, color: S.muted }}>💬 Type your answer in the Doubt Bot on the right. The AI will guide you if you are on the wrong track!</div>
                    </div>
                  )}
                </div>

                {/* Complete button */}
                <div style={{ padding: '0 36px 36px' }}>
                  {astatus === 'completed' ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, color: S.green, fontWeight: 800, fontSize: 13 }}>
                      <FiCheckCircle size={15} /> Topic Completed
                    </div>
                  ) : (
                    <motion.button onClick={markComplete} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 26px', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 13, color: '#fff', boxShadow: '0 6px 22px rgba(124,58,237,0.35)' }}>
                      Mark Complete & Continue <FiArrowRight size={14} />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: S.muted, fontSize: 14 }}>Select a topic to begin</div>
          )}
        </main>

        {/* RIGHT — doubt bot */}
        <aside style={{ width: 290, background: S.panel, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${S.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiMessageSquare size={13} color="#A78BFA" /><span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Doubt Bot</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: S.green }} />
              <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: S.muted }}>Live</span>
            </div>
          </div>
          {activeTopic && <div style={{ padding: '7px 14px', background: 'rgba(124,58,237,0.1)', borderBottom: `1px solid ${S.border}`, fontSize: 10, fontWeight: 700, color: S.accent }}>📍 {activeTopic.title}</div>}

          <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'ai' ? 'flex-start' : 'flex-end' }}>
                <div style={{ maxWidth: '88%', padding: '10px 12px', borderRadius: m.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px', fontSize: 12, lineHeight: 1.6, fontWeight: 500, background: m.role === 'ai' ? S.card : 'linear-gradient(135deg,#7C3AED,#A855F7)', color: m.role === 'ai' ? S.sub : '#fff', border: m.role === 'ai' ? `1px solid ${S.border}` : 'none' }}>
                  {m.content}
                </div>
              </div>
            ))}
            {botLoading && (
              <div style={{ display: 'flex', gap: 5, padding: '10px 14px', background: S.card, borderRadius: '4px 14px 14px 14px', width: 'fit-content', border: `1px solid ${S.border}` }}>
                {[0,1,2].map(i => <motion.div key={i} animate={{ y: [0,-4,0] }} transition={{ repeat: Infinity, duration: 0.7, delay: i*0.15 }} style={{ width: 6, height: 6, borderRadius: '50%', background: S.accent }} />)}
              </div>
            )}
          </div>

          <div style={{ padding: '10px', borderTop: `1px solid ${S.border}` }}>
            <div style={{ display: 'flex', gap: 8, background: S.card, border: `1px solid ${S.border}`, borderRadius: 11, padding: '8px 8px 8px 12px', alignItems: 'center' }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendDoubt()}
                placeholder={activeTopic ? 'Ask about this topic...' : 'Select a topic first...'}
                disabled={!activeTopic}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 12, color: S.text, fontFamily: 'inherit' }} />
              <button onClick={sendDoubt} disabled={!input.trim() || botLoading || !activeTopic}
                style={{ width: 30, height: 30, borderRadius: 8, border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', background: input.trim() ? 'linear-gradient(135deg,#7C3AED,#A855F7)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                <FiSend size={12} color={input.trim() ? '#fff' : S.muted} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
