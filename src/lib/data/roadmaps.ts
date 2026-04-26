// Job-Ready Roadmaps for Indian Students
// Focus: Portfolio projects + Interview preparation + Real resources

export interface RoadmapStep {
    week: number
    topic: string
    description: string
    resources: { name: string; url: string }[]
    practice?: string
}

export interface Topic {
    id: string
    title: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    duration: string
    youtubeUrl?: string
    pdfs?: { name: string; url: string }[]
}

export interface Chapter {
    id: string
    title: string
    description: string
    topics: Topic[]
    estimatedHours: number
}

export interface Roadmap {
    id: string
    title: string
    description: string
    duration: string
    level: 'beginner' | 'intermediate' | 'advanced'
    difficulty: string
    icon: string
    color: string
    steps: RoadmapStep[]
    chapters: Chapter[]
    skills: string[]
    careerOutcomes: string[]
    outcome: string
}

export const ROADMAPS: Record<string, Roadmap> = {
    frontend_react: {
        id: 'frontend_react',
        title: 'Frontend Developer (React)',
        description: 'Build modern web apps with React and get job-ready for Indian SaaS companies',
        duration: '12 weeks',
        level: 'beginner',
        difficulty: 'Beginner',
        icon: '⚛️',
        color: 'from-blue-500 to-cyan-600',
        outcome: 'Portfolio with 3 React projects + interview-ready',
        skills: ['React', 'JavaScript', 'HTML/CSS', 'TypeScript', 'REST APIs', 'Git'],
        careerOutcomes: ['Frontend Developer', 'React Developer', 'UI Engineer', 'Full Stack Developer'],
        chapters: [
            {
                id: 'ch1-web-fundamentals',
                title: 'Web Fundamentals',
                description: 'Master the core building blocks of web development',
                estimatedHours: 30,
                topics: [
                    { id: 'topic1', title: 'HTML & CSS Fundamentals', difficulty: 'Easy', duration: '10 hours' },
                    { id: 'topic2', title: 'JavaScript Basics', difficulty: 'Easy', duration: '10 hours' },
                    { id: 'topic3', title: 'JavaScript Advanced (ES6+)', difficulty: 'Medium', duration: '10 hours' }
                ]
            },
            {
                id: 'ch2-react-essentials',
                title: 'React Essentials',
                description: 'Learn React from fundamentals to advanced patterns',
                estimatedHours: 30,
                topics: [
                    { id: 'topic4', title: 'React Fundamentals', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic5', title: 'React Hooks & Context', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic6', title: 'React Router & APIs', difficulty: 'Medium', duration: '10 hours' }
                ]
            },
            {
                id: 'ch3-modern-dev',
                title: 'Modern Development',
                description: 'Professional tools and best practices',
                estimatedHours: 30,
                topics: [
                    { id: 'topic7', title: 'Tailwind CSS', difficulty: 'Easy', duration: '10 hours' },
                    { id: 'topic8', title: 'TypeScript Basics', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic9', title: 'State Management', difficulty: 'Hard', duration: '10 hours' }
                ]
            },
            {
                id: 'ch4-production-career',
                title: 'Production & Career',
                description: 'Deploy apps and prepare for interviews',
                estimatedHours: 30,
                topics: [
                    { id: 'topic10', title: 'Authentication', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic11', title: 'Deployment & CI/CD', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic12', title: 'Interview Prep', difficulty: 'Hard', duration: '10 hours' }
                ]
            },
            {
                id: 'ch5-ai-augmented-dev',
                title: 'AI-Augmented Development',
                description: 'Learn to work WITH AI tools — not just copy from them',
                estimatedHours: 25,
                topics: [
                    { id: 'ai-fe-1', title: 'Prompt Engineering for Frontend', difficulty: 'Medium', duration: '8 hours' },
                    { id: 'ai-fe-2', title: 'Debugging AI-Generated React Code', difficulty: 'Medium', duration: '8 hours' },
                    { id: 'ai-fe-3', title: 'AI Code Review & Verification', difficulty: 'Hard', duration: '9 hours' }
                ]
            }
        ],
        steps: [
            {
                week: 1,
                topic: 'HTML & CSS Fundamentals',
                description: 'Master semantic HTML and modern CSS',
                resources: [
                    { name: 'freeCodeCamp HTML', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' },
                    { name: 'CSS Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' }
                ],
                practice: 'Build a personal portfolio page'
            },
            {
                week: 2,
                topic: 'JavaScript Basics',
                description: 'Variables, functions, arrays, objects',
                resources: [
                    { name: 'JavaScript.info', url: 'https://javascript.info/first-steps' },
                    { name: 'Scrimba JavaScript', url: 'https://scrimba.com/learn/learnjavascript' }
                ],
                practice: 'Build a calculator app'
            },
            {
                week: 3,
                topic: 'JavaScript Advanced',
                description: 'ES6+, async/await, promises',
                resources: [
                    { name: 'ES6 for Everyone', url: 'https://es6.io/' },
                    { name: 'JavaScript30', url: 'https://javascript30.com/' }
                ],
                practice: 'Build a weather app using API'
            },
            {
                week: 4,
                topic: 'React Fundamentals',
                description: 'Components, props, state, JSX',
                resources: [
                    { name: 'React Official Docs', url: 'https://react.dev/learn' },
                    { name: 'Scrimba React Course', url: 'https://scrimba.com/learn/learnreact' }
                ],
                practice: 'Build a todo app'
            },
            {
                week: 5,
                topic: 'React Hooks & Context',
                description: 'useState, useEffect, useContext',
                resources: [
                    { name: 'React Hooks Guide', url: 'https://react.dev/reference/react' },
                    { name: 'Epic React', url: 'https://epicreact.dev/' }
                ],
                practice: 'Build a shopping cart'
            },
            {
                week: 6,
                topic: 'React Router & APIs',
                description: 'Navigation and data fetching',
                resources: [
                    { name: 'React Router', url: 'https://reactrouter.com/' },
                    { name: 'React Query', url: 'https://tanstack.com/query' }
                ],
                practice: 'Build a blog with API data'
            },
            {
                week: 7,
                topic: 'Tailwind CSS',
                description: 'Utility-first styling',
                resources: [
                    { name: 'Tailwind Docs', url: 'https://tailwindcss.com/docs' },
                    { name: 'Tailwind UI', url: 'https://tailwindui.com/' }
                ],
                practice: 'Redesign your portfolio with Tailwind'
            },
            {
                week: 8,
                topic: 'TypeScript Basics',
                description: 'Static typing for React',
                resources: [
                    { name: 'TypeScript for React', url: 'https://www.totaltypescript.com/tutorials/react' },
                    { name: 'TypeScript Docs', url: 'https://www.typescriptlang.org/docs/' }
                ],
                practice: 'Convert todo app to TypeScript'
            },
            {
                week: 9,
                topic: 'State Management',
                description: 'Zustand or Redux Toolkit',
                resources: [
                    { name: 'Zustand Tutorial', url: 'https://docs.pmnd.rs/zustand/getting-started/introduction' },
                    { name: 'Redux Toolkit', url: 'https://redux-toolkit.js.org/' }
                ],
                practice: 'Add state management to shopping cart'
            },
            {
                week: 10,
                topic: 'Authentication',
                description: 'User login/signup',
                resources: [
                    { name: 'Supabase Auth', url: 'https://supabase.com/docs/guides/auth' },
                    { name: 'NextAuth.js', url: 'https://next-auth.js.org/' }
                ],
                practice: 'Add login to your blog'
            },
            {
                week: 11,
                topic: 'Deployment & CI/CD',
                description: 'Deploy to Vercel',
                resources: [
                    { name: 'Vercel Deployment', url: 'https://vercel.com/docs' },
                    { name: 'GitHub Actions', url: 'https://docs.github.com/en/actions' }
                ],
                practice: 'Deploy all 3 projects'
            },
            {
                week: 12,
                topic: 'Interview Prep',
                description: 'DSA, system design, resume',
                resources: [
                    { name: 'NeetCode', url: 'https://neetcode.io/' },
                    { name: 'Pramp', url: 'https://www.pramp.com/' }
                ],
                practice: 'Mock interviews + resume review'
            }
        ]
    },

    backend_node: {
        id: 'backend_node',
        title: 'Backend Developer (Node.js)',
        description: 'Build APIs and backend services with Node.js and Express',
        duration: '12 weeks',
        level: 'beginner',
        difficulty: 'Beginner',
        icon: '🚀',
        color: 'from-green-500 to-emerald-600',
        outcome: 'REST API portfolio + database skills',
        skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'Authentication'],
        careerOutcomes: ['Backend Developer', 'API Developer', 'Node.js Engineer', 'Full Stack Developer'],
        chapters: [
            {
                id: 'ch1-js-node-basics',
                title: 'JavaScript & Node Basics',
                description: 'Foundation of backend development',
                estimatedHours: 30,
                topics: [
                    { id: 'topic1', title: 'JavaScript Fundamentals', difficulty: 'Easy', duration: '10 hours' },
                    { id: 'topic2', title: 'Node.js Basics', difficulty: 'Easy', duration: '10 hours' },
                    { id: 'topic3', title: 'Express.js & REST APIs', difficulty: 'Medium', duration: '10 hours' }
                ]
            },
            {
                id: 'ch2-database-auth',
                title: 'Database & Authentication',
                description: 'Data persistence and security',
                estimatedHours: 30,
                topics: [
                    { id: 'topic4', title: 'MongoDB & Mongoose', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic5', title: 'Authentication (JWT)', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic6', title: 'PostgreSQL & Prisma', difficulty: 'Medium', duration: '10 hours' }
                ]
            },
            {
                id: 'ch3-advanced-backend',
                title: 'Advanced Backend',
                description: 'Testing, GraphQL, and microservices',
                estimatedHours: 30,
                topics: [
                    { id: 'topic7', title: 'Testing (Jest, Supertest)', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic8', title: 'GraphQL & Apollo', difficulty: 'Hard', duration: '10 hours' },
                    { id: 'topic9', title: 'Microservices & Docker', difficulty: 'Hard', duration: '10 hours' }
                ]
            },
            {
                id: 'ch4-production-career',
                title: 'Production & Career',
                description: 'Deployment, performance, and interviews',
                estimatedHours: 30,
                topics: [
                    { id: 'topic10', title: 'Cloud Deployment', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic11', title: 'Performance & Caching', difficulty: 'Hard', duration: '10 hours' },
                    { id: 'topic12', title: 'Interview Prep', difficulty: 'Hard', duration: '10 hours' }
                ]
            },
            {
                id: 'ch5-ai-powered-backend',
                title: 'AI-Powered Backend',
                description: 'Use AI tools effectively for backend development',
                estimatedHours: 25,
                topics: [
                    { id: 'ai-be-1', title: 'Prompt Engineering for APIs', difficulty: 'Medium', duration: '8 hours' },
                    { id: 'ai-be-2', title: 'AI-Generated Schema & Code Review', difficulty: 'Medium', duration: '8 hours' },
                    { id: 'ai-be-3', title: 'AI-Assisted Testing & Debugging', difficulty: 'Hard', duration: '9 hours' }
                ]
            }
        ],
        steps: [
            {
                week: 1,
                topic: 'JavaScript Fundamentals',
                description: 'Variables, functions, objects',
                resources: [
                    { name: 'JavaScript.info', url: 'https://javascript.info/' },
                    { name: 'freeCodeCamp JS', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/' }
                ],
                practice: 'Build a number guessing game'
            },
            {
                week: 2,
                topic: 'Node.js Basics',
                description: 'Modules, npm, file system',
                resources: [
                    { name: 'Node.js Docs', url: 'https://nodejs.org/en/docs/' },
                    { name: 'The Net Ninja', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gcy9lrvMJ75z9maRw4byYp' }
                ],
                practice: 'Build a CLI todo app'
            },
            {
                week: 3,
                topic: 'Express.js',
                description: 'Routing, middleware, REST APIs',
                resources: [
                    { name: 'Express Guide', url: 'https://expressjs.com/' },
                    { name: 'Express Crash Course', url: 'https://www.youtube.com/watch?v=L72fhGm1tfE' }
                ],
                practice: 'Build a REST API for books'
            },
            {
                week: 4,
                topic: 'MongoDB',
                description: 'NoSQL database basics',
                resources: [
                    { name: 'MongoDB University', url: 'https://learn.mongodb.com/' },
                    { name: 'Mongoose Docs', url: 'https://mongoosejs.com/' }
                ],
                practice: 'Add database to books API'
            },
            {
                week: 5,
                topic: 'Authentication',
                description: 'JWT, bcrypt, sessions',
                resources: [
                    { name: 'JWT Guide', url: 'https://jwt.io/introduction' },
                    { name: 'Node Auth Tutorial', url: 'https://www.youtube.com/watch?v=2jqok-WgelI' }
                ],
                practice: 'Add user auth to API'
            },
            {
                week: 6,
                topic: 'PostgreSQL',
                description: 'SQL database with Node',
                resources: [
                    { name: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/' },
                    { name: 'Prisma ORM', url: 'https://www.prisma.io/docs' }
                ],
                practice: 'Build a blog API with PostgreSQL'
            },
            {
                week: 7,
                topic: 'Testing',
                description: 'Jest, Supertest',
                resources: [
                    { name: 'Jest Docs', url: 'https://jestjs.io/' },
                    { name: 'Testing Node APIs', url: 'https://www.youtube.com/watch?v=C3WbE9XcH2M' }
                ],
                practice: 'Write tests for blog API'
            },
            {
                week: 8,
                topic: 'GraphQL',
                description: 'Apollo Server basics',
                resources: [
                    { name: 'GraphQL Docs', url: 'https://graphql.org/learn/' },
                    { name: 'Apollo Server', url: 'https://www.apollographql.com/docs/apollo-server/' }
                ],
                practice: 'Convert REST API to GraphQL'
            },
            {
                week: 9,
                topic: 'Microservices',
                description: 'Docker, message queues',
                resources: [
                    { name: 'Docker for Node', url: 'https://nodejs.org/en/docs/guides/nodejs-docker-webapp' },
                    { name: 'Microservices Course', url: 'https://www.youtube.com/watch?v=1xo-li0l468' }
                ],
                practice: 'Dockerize your API'
            },
            {
                week: 10,
                topic: 'Cloud Deployment',
                description: 'AWS, Heroku, Railway',
                resources: [
                    { name: 'Railway Deployment', url: 'https://railway.app/' },
                    { name: 'AWS Free Tier', url: 'https://aws.amazon.com/free/' }
                ],
                practice: 'Deploy API to cloud'
            },
            {
                week: 11,
                topic: 'Performance',
                description: 'Caching, optimization',
                resources: [
                    { name: 'Redis for Node', url: 'https://redis.io/docs/clients/nodejs/' },
                    { name: 'Performance Tips', url: 'https://medium.com/@nodepractices/were-under-attack-23-node-js-security-best-practices-e33c18cb7d33' }
                ],
                practice: 'Add Redis caching'
            },
            {
                week: 12,
                topic: 'Interview Prep',
                description: 'System design, DSA',
                resources: [
                    { name: 'Grokking System Design', url: 'https://www.educative.io/courses/grokking-the-system-design-interview' },
                    { name: 'Backend Interview Questions', url: 'https://github.com/arialdomartini/Back-End-Developer-Interview-Questions' }
                ],
                practice: 'Mock system design interviews'
            }
        ]
    },

    dsa_interview: {
        id: 'dsa_interview',
        title: 'DSA for Interviews',
        description: 'Master data structures and algorithms for coding interviews',
        duration: '16 weeks',
        level: 'intermediate',
        difficulty: 'Intermediate',
        icon: '🧠',
        color: 'from-purple-500 to-pink-600',
        outcome: 'Solve 200+ LeetCode problems + ace technical interviews',
        skills: ['Data Structures', 'Algorithms', 'Problem Solving', 'Time Complexity', 'Dynamic Programming'],
        careerOutcomes: ['Software Engineer', 'Algorithm Engineer', 'Competitive Programmer', 'Tech Interview Expert'],
        chapters: [
            {
                id: 'ch1-basic-ds',
                title: 'Basic Data Structures',
                description: 'Arrays, strings, hash tables, and linked lists',
                estimatedHours: 40,
                topics: [
                    { id: 'topic1', title: 'Arrays & Strings', difficulty: 'Easy', duration: '10 hours' },
                    { id: 'topic2', title: 'Hash Tables', difficulty: 'Easy', duration: '10 hours' },
                    { id: 'topic3', title: 'Linked Lists', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic4', title: 'Stacks & Queues', difficulty: 'Medium', duration: '10 hours' }
                ]
            },
            {
                id: 'ch2-trees-heaps',
                title: 'Trees & Heaps',
                description: 'Binary trees, BST, and priority queues',
                estimatedHours: 40,
                topics: [
                    { id: 'topic5', title: 'Binary Trees', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic6', title: 'Binary Search Trees', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic7', title: 'Heaps & Priority Queues', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic8', title: 'Tries', difficulty: 'Medium', duration: '10 hours' }
                ]
            },
            {
                id: 'ch3-graphs-advanced',
                title: 'Graphs & Advanced Topics',
                description: 'Graph algorithms and complex patterns',
                estimatedHours: 40,
                topics: [
                    { id: 'topic9', title: 'Graphs (BFS/DFS)', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic10', title: 'Advanced Graph Algorithms', difficulty: 'Hard', duration: '10 hours' },
                    { id: 'topic11', title: 'Intervals & Backtracking', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'topic12', title: 'Greedy Algorithms', difficulty: 'Medium', duration: '10 hours' }
                ]
            },
            {
                id: 'ch4-dp-interviews',
                title: 'Dynamic Programming & Interviews',
                description: 'DP mastery and mock interviews',
                estimatedHours: 40,
                topics: [
                    { id: 'topic13', title: 'Dynamic Programming Basics', difficulty: 'Hard', duration: '10 hours' },
                    { id: 'topic14', title: 'Advanced DP', difficulty: 'Hard', duration: '10 hours' },
                    { id: 'topic15', title: 'Mock Interviews', difficulty: 'Hard', duration: '10 hours' },
                    { id: 'topic16', title: 'System Design Prep', difficulty: 'Hard', duration: '10 hours' }
                ]
            },
            {
                id: 'ch5-ai-assisted-dsa',
                title: 'AI-Assisted Problem Solving',
                description: 'Use AI strategically for DSA without losing your own skills',
                estimatedHours: 25,
                topics: [
                    { id: 'ai-dsa-1', title: 'Using AI for DSA Strategy', difficulty: 'Medium', duration: '8 hours' },
                    { id: 'ai-dsa-2', title: 'Validating AI-Generated Solutions', difficulty: 'Hard', duration: '8 hours' },
                    { id: 'ai-dsa-3', title: 'AI Debugging for Complex Algorithms', difficulty: 'Hard', duration: '9 hours' }
                ]
            }
        ],
        steps: [
            {
                week: 1,
                topic: 'Arrays & Strings',
                description: 'Two pointers, sliding window',
                resources: [
                    { name: 'NeetCode Arrays', url: 'https://neetcode.io/practice' },
                    { name: 'LeetCode Patterns', url: 'https://seanprashad.com/leetcode-patterns/' }
                ],
                practice: 'Solve 15 array problems'
            },
            {
                week: 2,
                topic: 'Hash Tables',
                description: 'Maps, sets, frequency counting',
                resources: [
                    { name: 'NeetCode HashMaps', url: 'https://neetcode.io/practice' },
                    { name: 'CS Dojo Hash Tables', url: 'https://www.youtube.com/watch?v=shs0KM3wKv8' }
                ],
                practice: 'Solve 10 hash table problems'
            },
            {
                week: 3,
                topic: 'Linked Lists',
                description: 'Singly, doubly, circular',
                resources: [
                    { name: 'NeetCode Linked Lists', url: 'https://neetcode.io/practice' },
                    { name: 'Linked List Visualization', url: 'https://visualgo.net/en/list' }
                ],
                practice: 'Solve 10 linked list problems'
            },
            {
                week: 4,
                topic: 'Stacks & Queues',
                description: 'LIFO, FIFO, monotonic stacks',
                resources: [
                    { name: 'NeetCode Stacks', url: 'https://neetcode.io/practice' },
                    { name: 'Stack/Queue Guide', url: 'https://www.geeksforgeeks.org/stack-data-structure/' }
                ],
                practice: 'Solve 10 stack/queue problems'
            },
            {
                week: 5,
                topic: 'Trees (Basics)',
                description: 'Binary trees, traversals',
                resources: [
                    { name: 'NeetCode Trees', url: 'https://neetcode.io/practice' },
                    { name: 'Tree Visualization', url: 'https://visualgo.net/en/bst' }
                ],
                practice: 'Solve 10 tree problems'
            },
            {
                week: 6,
                topic: 'Binary Search Trees',
                description: 'BST operations, AVL basics',
                resources: [
                    { name: 'BST Guide', url: 'https://www.programiz.com/dsa/binary-search-tree' },
                    { name: 'NeetCode BST', url: 'https://neetcode.io/practice' }
                ],
                practice: 'Solve 10 BST problems'
            },
            {
                week: 7,
                topic: 'Heaps & Priority Queues',
                description: 'Min/max heaps, heapify',
                resources: [
                    { name: 'Heap Guide', url: 'https://www.programiz.com/dsa/heap' },
                    { name: 'NeetCode Heaps', url: 'https://neetcode.io/practice' }
                ],
                practice: 'Solve 8 heap problems'
            },
            {
                week: 8,
                topic: 'Graphs (Basics)',
                description: 'Adjacency list, BFS, DFS',
                resources: [
                    { name: 'Graph Guide', url: 'https://www.programiz.com/dsa/graph' },
                    { name: 'NeetCode Graphs', url: 'https://neetcode.io/practice' }
                ],
                practice: 'Solve 8 graph problems'
            },
            {
                week: 9,
                topic: 'Graph Algorithms',
                description: 'Dijkstra, topological sort',
                resources: [
                    { name: 'Graph Algorithms', url: 'https://cp-algorithms.com/graph/' },
                    { name: 'NeetCode Advanced Graphs', url: 'https://neetcode.io/practice' }
                ],
                practice: 'Solve 8 advanced graph problems'
            },
            {
                week: 10,
                topic: 'Tries',
                description: 'Prefix trees, autocomplete',
                resources: [
                    { name: 'Trie Guide', url: 'https://www.programiz.com/dsa/trie' },
                    { name: 'NeetCode Tries', url: 'https://neetcode.io/practice' }
                ],
                practice: 'Solve 6 trie problems'
            },
            {
                week: 11,
                topic: 'Intervals',
                description: 'Merge intervals, calendar',
                resources: [
                    { name: 'Interval Patterns', url: 'https://seanprashad.com/leetcode-patterns/' },
                    { name: 'NeetCode Intervals', url: 'https://neetcode.io/practice' }
                ],
                practice: 'Solve 8 interval problems'
            },
            {
                week: 12,
                topic: 'Backtracking',
                description: 'Recursion, permutations',
                resources: [
                    { name: 'Backtracking Guide', url: 'https://www.geeksforgeeks.org/backtracking-algorithms/' },
                    { name: 'NeetCode Backtracking', url: 'https://neetcode.io/practice' }
                ],
                practice: 'Solve 8 backtracking problems'
            },
            {
                week: 13,
                topic: 'Dynamic Programming (Basics)',
                description: 'Memoization, tabulation',
                resources: [
                    { name: 'DP Guide', url: 'https://www.geeksforgeeks.org/dynamic-programming/' },
                    { name: 'NeetCode DP', url: 'https://neetcode.io/practice' }
                ],
                practice: 'Solve 10 DP problems'
            },
            {
                week: 14,
                topic: 'Advanced DP',
                description: '2D DP, knapsack',
                resources: [
                    { name: 'Advanced DP', url: 'https://cp-algorithms.com/dynamic_programming/divide-and-conquer-dp.html' },
                    { name: 'NeetCode Advanced DP', url: 'https://neetcode.io/practice' }
                ],
                practice: 'Solve 10 advanced DP problems'
            },
            {
                week: 15,
                topic: 'Greedy Algorithms',
                description: 'Activity selection, coin change',
                resources: [
                    { name: 'Greedy Guide', url: 'https://www.geeksforgeeks.org/greedy-algorithms/' },
                    { name: 'NeetCode Greedy', url: 'https://neetcode.io/practice' }
                ],
                practice: 'Solve 8 greedy problems'
            },
            {
                week: 16,
                topic: 'Mock Interviews',
                description: 'Full interview simulations',
                resources: [
                    { name: 'Pramp', url: 'https://www.pramp.com/' },
                    { name: 'LeetCode Mock', url: 'https://leetcode.com/interview/' }
                ],
                practice: 'Complete 5 mock interviews'
            }
        ]
    },

    ai_nlp: {
        id: 'ai_nlp',
        title: 'Natural Language Processing',
        description: 'Build systems that understand, interpret, and generate human language using deep learning.',
        duration: '14 weeks',
        level: 'intermediate',
        difficulty: 'Intermediate',
        icon: '💬',
        color: 'from-orange-500 to-red-600',
        outcome: 'Built 3 NLP applications + fine-tuned LLM portfolio',
        skills: ['Python', 'PyTorch', 'Transformers', 'Deep Learning', 'Tokenization', 'Vector DBs'],
        careerOutcomes: ['NLP Engineer', 'ML Engineer', 'AI Research Scientist', 'Data Scientist'],
        chapters: [
            {
                id: 'ch1-python-nlp-basics',
                title: 'Python & Text Processing',
                description: 'Fundamentals of processing human language with code',
                estimatedHours: 35,
                topics: [
                    { id: 'nlp1', title: 'Python for Data Science', difficulty: 'Easy', duration: '12 hours' },
                    { id: 'nlp2', title: 'Tokenization & Normalization', difficulty: 'Easy', duration: '10 hours' },
                    { id: 'nlp3', title: 'Regex & Linguistic Features', difficulty: 'Medium', duration: '13 hours' }
                ]
            },
            {
                id: 'ch2-embeddings-sequence',
                title: 'Embeddings & Neural Nets',
                description: 'Turning words into numbers and processing sequences',
                estimatedHours: 40,
                topics: [
                    { id: 'nlp4', title: 'Word2Vec & GloVe', difficulty: 'Medium', duration: '12 hours' },
                    { id: 'nlp5', title: 'RNNs and LSTMs', difficulty: 'Medium', duration: '14 hours' },
                    { id: 'nlp6', title: 'Attention Mechanism', difficulty: 'Hard', duration: '14 hours' }
                ]
            },
            {
                id: 'ch3-transformer-era',
                title: 'The Transformer Era',
                description: 'Modern NLP architecture and BERT-style models',
                estimatedHours: 45,
                topics: [
                    { id: 'nlp7', title: 'Transformer Architecture', difficulty: 'Hard', duration: '15 hours' },
                    { id: 'nlp8', title: 'BERT & HuggingFace', difficulty: 'Hard', duration: '15 hours' },
                    { id: 'nlp9', title: 'Sentiment & NER Tasks', difficulty: 'Medium', duration: '15 hours' }
                ]
            },
            {
                id: 'ch4-llm-future',
                title: 'LLMs & Generative AI',
                description: 'Generative pre-training and building with LLMs',
                estimatedHours: 50,
                topics: [
                    { id: 'nlp10', title: 'GPT Architecture', difficulty: 'Hard', duration: '15 hours' },
                    { id: 'nlp11', title: 'Prompt Engineering & RAG', difficulty: 'Medium', duration: '15 hours' },
                    { id: 'nlp12', title: 'Fine-tuning & RLHF', difficulty: 'Hard', duration: '20 hours' }
                ]
            }
        ],
        steps: [
            {
                week: 1,
                topic: 'Python for NLP',
                description: 'Pandas, NumPy, and string manipulation',
                resources: [
                    { name: 'NLTK Book', url: 'https://www.nltk.org/book/' },
                    { name: 'Python for DS', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/' }
                ],
                practice: 'Clean and tokenize a text dataset'
            },
            {
                week: 2,
                topic: 'Embeddings',
                description: 'Word vectors and similarity',
                resources: [
                    { name: 'Jay Alammar - Word2Vec', url: 'https://jalammar.github.io/illustrated-word2vec/' }
                ],
                practice: 'Build a semantic search tool'
            }
        ]
    },

    data_science_python: {
        id: 'data_science_python',
        title: 'Data Science with Python',
        description: 'Master the art of extracting insights from data using the Python ecosystem.',
        duration: '12 weeks',
        level: 'beginner',
        difficulty: 'Beginner',
        icon: '📊',
        color: 'from-blue-400 to-indigo-600',
        outcome: '3 real-world data analysis projects + SQL mastery',
        skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'SQL', 'Statistics'],
        careerOutcomes: ['Data Analyst', 'Junior Data Scientist', 'Business Analyst'],
        chapters: [
            {
                id: 'ds-ch1-python-foundations',
                title: 'Data Foundations',
                description: 'Python for analysis and data manipulation',
                estimatedHours: 35,
                topics: [
                    { id: 'ds1', title: 'Python for Data Science', difficulty: 'Easy', duration: '12 hours' },
                    { id: 'ds2', title: 'NumPy & Efficient Computation', difficulty: 'Easy', duration: '10 hours' },
                    { id: 'ds3', title: 'Pandas Deep Dive', difficulty: 'Medium', duration: '13 hours' }
                ]
            },
            {
                id: 'ds-ch2-viz-viz-stats',
                title: 'Viz & Statistics',
                description: 'Visualizing data and understanding the math behind it',
                estimatedHours: 40,
                topics: [
                    { id: 'ds4', title: 'Matplotlib & Seaborn', difficulty: 'Easy', duration: '15 hours' },
                    { id: 'ds5', title: 'Descriptive Statistics', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'ds6', title: 'Inferential Statistics', difficulty: 'Hard', duration: '15 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'Python for Data Science', description: 'Setup environment and learn basic syntax', resources: [], practice: 'Analyze a Titanic dataset' }
        ]
    },

    machine_learning: {
        id: 'machine_learning',
        title: 'Machine Learning Engineer',
        description: 'Design and build intelligent systems that learn from data.',
        duration: '16 weeks',
        level: 'intermediate',
        difficulty: 'Intermediate',
        icon: '🤖',
        color: 'from-purple-600 to-indigo-900',
        outcome: 'Deployed ML models + Scikit-learn mastery',
        skills: ['Scikit-learn', 'Regression', 'Classification', 'Clustering', 'Model Deployment'],
        careerOutcomes: ['ML Engineer', 'Data Scientist', 'Research Engineer'],
        chapters: [
            {
                id: 'ml-ch1-supervised',
                title: 'Supervised Learning',
                description: 'Regression and classification algorithms',
                estimatedHours: 40,
                topics: [
                    { id: 'ml1', title: 'Linear & Logistic Regression', difficulty: 'Medium', duration: '15 hours' },
                    { id: 'ml2', title: 'Decision Trees & Random Forests', difficulty: 'Medium', duration: '15 hours' },
                    { id: 'ml3', title: 'Support Vector Machines', difficulty: 'Hard', duration: '10 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'Intro to ML', description: 'Understand the big picture of machine learning', resources: [], practice: 'House price prediction' }
        ]
    },

    python_beginner: {
        id: 'python_beginner',
        title: 'Python for Beginners',
        description: 'The absolute starting point for your coding journey.',
        duration: '6 weeks',
        level: 'beginner',
        difficulty: 'Beginner',
        icon: '🐍',
        color: 'from-yellow-400 to-blue-500',
        outcome: 'Built 5 mini-projects + coding basics',
        skills: ['Python Basics', 'Logic', 'Loops', 'Functions', 'Data Types'],
        careerOutcomes: ['Student', 'Automation Analyst', 'Backend Dev Prep'],
        chapters: [
            {
                id: 'py-ch1-basics',
                title: 'Coding Foundations',
                description: 'Learn the core building blocks of programming',
                estimatedHours: 20,
                topics: [
                    { id: 'py1', title: 'Variables & Data Types', difficulty: 'Easy', duration: '5 hours' },
                    { id: 'py2', title: 'Control Flow (If/Else)', difficulty: 'Easy', duration: '7 hours' },
                    { id: 'py3', title: 'Loops & Iterations', difficulty: 'Easy', duration: '8 hours' }
                ]
            },
            {
                id: 'py-ch2-ai-fluency',
                title: 'AI Fluency Basics',
                description: 'Learn to use AI tools responsibly from day one',
                estimatedHours: 15,
                topics: [
                    { id: 'ai-py-1', title: 'Prompt Engineering 101', difficulty: 'Easy', duration: '5 hours' },
                    { id: 'ai-py-2', title: 'Reading & Verifying AI-Generated Code', difficulty: 'Medium', duration: '5 hours' },
                    { id: 'ai-py-3', title: 'AI Ethics & Responsible Usage', difficulty: 'Easy', duration: '5 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'Hello World', description: 'Install Python and run your first script', resources: [], practice: 'Build a calculator' }
        ]
    },

    fullstack_mern: {
        id: 'fullstack_mern',
        title: 'Full Stack (MERN)',
        description: 'Master the MongoDB, Express, React, and Node.js stack to build modern web apps.',
        duration: '16 weeks',
        level: 'intermediate',
        difficulty: 'Intermediate',
        icon: '📚',
        color: 'from-green-400 to-blue-600',
        outcome: 'Built a full-scale social media or e-commerce app',
        skills: ['MongoDB', 'Express', 'React', 'Node.js', 'Auth', 'Deployment'],
        careerOutcomes: ['Full Stack Developer', 'MERN Stack Developer', 'Software Engineer'],
        chapters: [
            {
                id: 'mern-ch1-frontend',
                title: 'Frontend Mastery (React)',
                description: 'Build complex UIs with React',
                estimatedHours: 40,
                topics: [
                    { id: 'mern1', title: 'Advanced React Patterns', difficulty: 'Medium', duration: '20 hours' },
                    { id: 'mern2', title: 'State Management (Redux)', difficulty: 'Hard', duration: '20 hours' }
                ]
            },
            {
                id: 'mern-ch2-backend',
                title: 'Backend Mastery (Node/Express)',
                description: 'Robus APIs and Server Logic',
                estimatedHours: 40,
                topics: [
                    { id: 'mern3', title: 'Server Architecture', difficulty: 'Medium', duration: '20 hours' },
                    { id: 'mern4', title: 'NoSQL Design (MongoDB)', difficulty: 'Medium', duration: '20 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'MERN Integration', description: 'Connect React with Express', resources: [], practice: 'Build a notes app' }
        ]
    },

    mobile_flutter: {
        id: 'mobile_flutter',
        title: 'Flutter Developer',
        description: 'Build beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.',
        duration: '12 weeks',
        level: 'beginner',
        difficulty: 'Beginner',
        icon: '🦋',
        color: 'from-blue-400 to-cyan-500',
        outcome: '2 Flutter apps on Play Store/App Store + Dart mastery',
        skills: ['Dart', 'Flutter Widgets', 'State Management', 'Firebase', 'Native Features'],
        careerOutcomes: ['Flutter Developer', 'Mobile App Engineer', 'UI Developer'],
        chapters: [
            {
                id: 'flut-ch1-dart',
                title: 'Dart Foundations',
                description: 'The language behind Flutter',
                estimatedHours: 30,
                topics: [
                    { id: 'flut1', title: 'Dart Syntax & OOP', difficulty: 'Easy', duration: '15 hours' },
                    { id: 'flut2', title: 'Asynchronous Programming', difficulty: 'Medium', duration: '15 hours' }
                ]
            },
            {
                id: 'flut-ch2-widgets',
                title: 'Flutter UI',
                description: 'Building beautiful layouts',
                estimatedHours: 40,
                topics: [
                    { id: 'flut3', title: 'Material & Cupertino Widgets', difficulty: 'Easy', duration: '20 hours' },
                    { id: 'flut4', title: 'Custom Painting & Animation', difficulty: 'Hard', duration: '20 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'Flutter Setup', description: 'Install SDK and build first app', resources: [], practice: 'Build a weather app' }
        ]
    },

    mobile_react_native: {
        id: 'mobile_react_native',
        title: 'React Native Developer',
        description: 'Use your React skills to build native mobile apps for iOS and Android.',
        duration: '10 weeks',
        level: 'intermediate',
        difficulty: 'Intermediate',
        icon: '📱',
        color: 'from-cyan-400 to-blue-700',
        outcome: 'Built a cross-platform mobile app + Expo mastery',
        skills: ['React Native', 'Expo', 'Native Hooks', 'Navigation', 'Native Modules'],
        careerOutcomes: ['React Native Developer', 'Mobile Developer', 'Frontend Engineer'],
        chapters: [
            {
                id: 'rn-ch1-basics',
                title: 'Mobile React Essentials',
                description: 'React for mobile screens',
                estimatedHours: 35,
                topics: [
                    { id: 'rn1', title: 'React Native Components', difficulty: 'Medium', duration: '15 hours' },
                    { id: 'rn2', title: 'Flexbox & Styling', difficulty: 'Easy', duration: '10 hours' },
                    { id: 'rn3', title: 'React Navigation', difficulty: 'Medium', duration: '10 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'Expo Workflow', description: 'Initialize project with Expo', resources: [], practice: 'Build a contact list' }
        ]
    },

    frontend_vue: {
        id: 'frontend_vue',
        title: 'Frontend Developer (Vue.js)',
        description: 'Build fast, interactive web interfaces with the progressive Vue.js framework.',
        duration: '10 weeks',
        level: 'beginner',
        difficulty: 'Beginner',
        icon: '🟢',
        color: 'from-emerald-400 to-green-600',
        outcome: 'Vuetify portfolio + Composition API mastery',
        skills: ['Vue 3', 'Composition API', 'Pinia', 'Vue Router', 'Vite'],
        careerOutcomes: ['Vue Developer', 'Frontend Engineer', 'Web Developer'],
        chapters: [
            {
                id: 'vue-ch1-essentials',
                title: 'Vue Foundations',
                description: 'Core concepts of reactive web apps',
                estimatedHours: 30,
                topics: [
                    { id: 'vue1', title: 'Vue Template Syntax', difficulty: 'Easy', duration: '10 hours' },
                    { id: 'vue2', title: 'Reactivity & Composition API', difficulty: 'Medium', duration: '20 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'Vue Basics', description: 'Create a Vue app with Vite', resources: [], practice: 'Build a task tracker' }
        ]
    },

    devops_docker: {
        id: 'devops_docker',
        title: 'Docker & Kubernetes',
        description: 'Master containerization and orchestration to deploy and scale applications like a pro.',
        duration: '8 weeks',
        level: 'intermediate',
        difficulty: 'Hard',
        icon: '🐳',
        color: 'from-blue-600 to-blue-900',
        outcome: 'Built a multi-container microservices architecture',
        skills: ['Docker', 'Kubernetes', 'CI/CD', 'YAML', 'Networking'],
        careerOutcomes: ['DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer'],
        chapters: [
            {
                id: 'docker-ch1',
                title: 'Container Basics',
                description: 'Docker fundamentals',
                estimatedHours: 20,
                topics: [
                    { id: 'dock1', title: 'Images & Containers', difficulty: 'Medium', duration: '10 hours' },
                    { id: 'dock2', title: 'Docker Compose', difficulty: 'Medium', duration: '10 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'Docker Intro', description: 'Install Docker and run nginx', resources: [], practice: 'Containerize a Node.js app' }
        ]
    },

    cybersecurity: {
        id: 'cybersecurity',
        title: 'Cybersecurity Fundamentals',
        description: 'Protect systems and networks from digital attacks. Learn the hacker mindset to build stronger defenses.',
        duration: '12 weeks',
        level: 'beginner',
        difficulty: 'Intermediate',
        icon: '🔐',
        color: 'from-red-600 to-black',
        outcome: 'Ready for CompTIA Security+ + basic pen-testing skills',
        skills: ['Networking', 'Cryptography', 'Ethical Hacking', 'Security Auditing'],
        careerOutcomes: ['Security Analyst', 'Penetration Tester', 'Security Engineer'],
        chapters: [
            {
                id: 'cyb-ch1',
                title: 'Security Foundations',
                description: 'Basic principles of InfoSec',
                estimatedHours: 35,
                topics: [
                    { id: 'cyb1', title: 'The CIA Triad', difficulty: 'Easy', duration: '10 hours' },
                    { id: 'cyb2', title: 'Network Security', difficulty: 'Medium', duration: '20 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'Security Intro', description: 'Understand the security landscape', resources: [], practice: 'Set up a home lab' }
        ]
    },

    blockchain: {
        id: 'blockchain',
        title: 'Blockchain Development',
        description: 'Build decentralized applications (dApps) on the blockchain using Solidity and Web3 technologies.',
        duration: '14 weeks',
        level: 'advanced',
        difficulty: 'Hard',
        icon: '⛓️',
        color: 'from-purple-800 to-blue-900',
        outcome: 'Deployed Smart Contracts on Ethereum + 2 dApp portfolio',
        skills: ['Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts', 'DeFi'],
        careerOutcomes: ['Blockchain Developer', 'Smart Contract Engineer', 'Web3 Architect'],
        chapters: [
            {
                id: 'block-ch1',
                title: 'Web3 Foundations',
                description: 'Decentralization and crypto basics',
                estimatedHours: 30,
                topics: [
                    { id: 'block1', title: 'How Blockchain Works', difficulty: 'Medium', duration: '15 hours' },
                    { id: 'block2', title: 'Solidity Syntax', difficulty: 'Hard', duration: '15 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'Solidity Intro', description: 'Write your first smart contract', resources: [], practice: 'Build a Simple Voting dApp' }
        ]
    },

    game_dev_unity: {
        id: 'game_dev_unity',
        title: 'Game Development (Unity)',
        description: 'Bring your ideas to life. Create 2D and 3D games using the industry-leading Unity engine.',
        duration: '16 weeks',
        level: 'beginner',
        difficulty: 'Intermediate',
        icon: '🎮',
        color: 'from-gray-700 to-black',
        outcome: '2 published games + C# mastery for games',
        skills: ['C#', 'Unity Engine', '3D Modeling basics', 'Physics', 'Game Loop'],
        careerOutcomes: ['Game Developer', 'VR/AR Developer', 'Unity Engineer'],
        chapters: [
            {
                id: 'game-ch1',
                title: 'Unity Basics',
                description: 'Navigating the engine and C# fundamentals',
                estimatedHours: 40,
                topics: [
                    { id: 'game1', title: 'C# for Games', difficulty: 'Medium', duration: '20 hours' },
                    { id: 'game2', title: 'Unity Interface & 2D', difficulty: 'Easy', duration: '20 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'First Project', description: 'Create a Flappy Bird clone', resources: [], practice: 'Implement basic physics' }
        ]
    },

    backend_python: {
        id: 'backend_python',
        title: 'Backend Developer (Python/Django)',
        description: 'Build high-performance, secure backend systems with Python and the powerful Django framework.',
        duration: '12 weeks',
        level: 'intermediate',
        difficulty: 'Intermediate',
        icon: '🐍',
        color: 'from-emerald-700 to-blue-900',
        outcome: '3 scalable Django/DRF apps + SQL mastery',
        skills: ['Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'Auth'],
        careerOutcomes: ['Python Developer', 'Backend Engineer', 'Django Dev'],
        chapters: [
            {
                id: 'dj-ch1',
                title: 'Django Foundations',
                description: 'MTV architecture and models',
                estimatedHours: 35,
                topics: [
                    { id: 'dj1', title: 'Django Models & Admin', difficulty: 'Medium', duration: '15 hours' },
                    { id: 'dj2', title: 'Views & Templates', difficulty: 'Easy', duration: '20 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'Django Setup', description: 'Create a blog project', resources: [], practice: 'Implement user registration' }
        ]
    },

    mobile_android: {
        id: 'mobile_android',
        title: 'Android Developer (Kotlin)',
        description: 'Master modern Android development using Kotlin and Jetpack Compose.',
        duration: '14 weeks',
        level: 'beginner',
        difficulty: 'Intermediate',
        icon: '🤖',
        color: 'from-green-500 to-emerald-800',
        outcome: 'Built 2 Android apps + Kotlin mastery',
        skills: ['Kotlin', 'Jetpack Compose', 'MVVM', 'Retrofit', 'Coroutines'],
        careerOutcomes: ['Android Developer', 'Mobile Engineer', 'Kotlin Dev'],
        chapters: [
            {
                id: 'and-ch1',
                title: 'Kotlin & Compose',
                description: 'The modern way to build Android apps',
                estimatedHours: 40,
                topics: [
                    { id: 'and1', title: 'Kotlin Fundamentals', difficulty: 'Easy', duration: '20 hours' },
                    { id: 'and2', title: 'Jetpack Compose Basics', difficulty: 'Medium', duration: '20 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'Android Studio', description: 'Set up environment and build Hello World', resources: [], practice: 'Build a unit converter' }
        ]
    },

    javascript_mastery: {
        id: 'javascript_mastery',
        title: 'JavaScript Mastery',
        description: 'Deep dive into the engine. Master closures, prototypes, async, and advanced patterns.',
        duration: '8 weeks',
        level: 'advanced',
        difficulty: 'Hard',
        icon: '🟨',
        color: 'from-yellow-400 to-yellow-600',
        outcome: 'Built a custom JS framework + deep engine knowledge',
        skills: ['V8 Engine', 'Event Loop', 'Design Patterns', 'Functional Programming'],
        careerOutcomes: ['Senior Frontend Dev', 'Full Stack Architect', 'Lead JS Engineer'],
        chapters: [
            {
                id: 'jsm-ch1',
                title: 'The Engine Room',
                description: 'Understanding how JS actually runs',
                estimatedHours: 35,
                topics: [
                    { id: 'jsm1', title: 'Execution Context & Scope', difficulty: 'Hard', duration: '15 hours' },
                    { id: 'jsm2', title: 'Prototypes & Classes', difficulty: 'Hard', duration: '20 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'Event Loop', description: 'Master the event loop and microtasks', resources: [], practice: 'Build a custom Promise implementation' }
        ]
    },

    devops_aws: {
        id: 'devops_aws',
        title: 'DevOps with AWS',
        description: 'Deploy, manage, and scale applications on the world\'s leading cloud platform.',
        duration: '12 weeks',
        level: 'intermediate',
        difficulty: 'Hard',
        icon: '☁️',
        color: 'from-orange-400 to-gray-800',
        outcome: 'AWS Cloud Practitioner ready + Terraform mastery',
        skills: ['EC2', 'S3', 'Lambda', 'Terraform', 'CI/CD'],
        careerOutcomes: ['AWS Architect', 'Cloud Ops Engineer', 'DevOps Specialist'],
        chapters: [
            {
                id: 'aws-ch1',
                title: 'AWS Core Services',
                description: 'Compute, Storage, and Networking',
                estimatedHours: 40,
                topics: [
                    { id: 'aws1', title: 'EC2 & VPC', difficulty: 'Medium', duration: '20 hours' },
                    { id: 'aws2', title: 'Serverless (Lambda/API Gateway)', difficulty: 'Hard', duration: '20 hours' }
                ]
            }
        ],
        steps: [
            { week: 1, topic: 'AWS Console', description: 'Navigate the console and launch an EC2', resources: [], practice: 'Host a static site on S3' }
        ]
    }
}

export const getRoadmapById = (id: string): Roadmap | null => {
    return ROADMAPS[id] || null
}

export const getAllRoadmaps = (): Roadmap[] => {
    return Object.values(ROADMAPS)
}
