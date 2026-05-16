export interface ResourceLink {
  title: string;
  url: string;
  badge: 'MDN' | 'Docs' | 'freeCodeCamp' | 'Guide' | 'Tutorial';
}

export interface TopicResource {
  videoId: string;
  resources: ResourceLink[];
}

/**
 * MASTER RESOURCE REPOSITORY
 * Grouped by technology to prevent cross-course leakage.
 * The 'getTopicResource' function performs a smart lookup.
 */
const RAW: Record<string, TopicResource> = {
  // ── HTML & CSS ────────────────────────────────────────────────────────
  'semantic html': {
    videoId: 'kUMe1FH4CHE',
    resources: [
      { title: 'MDN: HTML elements reference', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element', badge: 'MDN' },
      { title: 'freeCodeCamp: Semantic HTML Guide', url: 'https://www.freecodecamp.org/news/semantic-html5-elements/', badge: 'freeCodeCamp' },
    ],
  },
  'flexbox & grid': {
    videoId: 'OXGznpKZ_sA',
    resources: [
      { title: 'MDN: CSS Flexbox', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox', badge: 'MDN' },
      { title: 'CSS Tricks: Complete Guide to Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', badge: 'Guide' },
    ],
  },
  'responsive design': {
    videoId: 'srvUrASNj0s',
    resources: [
      { title: 'MDN: Responsive Design', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design', badge: 'MDN' },
    ],
  },

  // ── JavaScript Mastery (Traversy & Codevolution) ──────────────────────
  'es6+ syntax': {
    videoId: 'NCwa_xi0Uuc',
    resources: [{ title: 'freeCodeCamp: ES6 Guide', url: 'https://www.freecodecamp.org/news/write-less-do-more-with-javascript-es6-5fd4a8e50ee2/', badge: 'freeCodeCamp' }],
  },
  'dom manipulation': {
    videoId: '5fb2aPlgoys',
    resources: [{ title: 'freeCodeCamp: DOM Manipulation', url: 'https://www.freecodecamp.org/news/javascript-dom-manipulation/', badge: 'freeCodeCamp' }],
  },
  'async/await': {
    videoId: 'V_Kr9OSfDeU',
    resources: [{ title: 'MDN: async/await', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises', badge: 'MDN' }],
  },
  'javascript fundamentals': {
    videoId: 'PkZNo7MFNFg',
    resources: [{ title: 'freeCodeCamp: JS Course', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', badge: 'Tutorial' }],
  },

  // ── React (Traversy Media & Codevolution) ──────────────────────────────
  'react fundamentals': {
    videoId: 'w7ejDZ8SWv8', // Traversy
    resources: [
      { title: 'React Docs', url: 'https://react.dev/learn', badge: 'Docs' },
      { title: 'Traversy: React Crash Course', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', badge: 'Tutorial' },
    ],
  },
  'react hooks': {
    videoId: 'O6P86uwfdR0', // Codevolution
    resources: [
      { title: 'Codevolution: React Hooks', url: 'https://www.youtube.com/playlist?list=PLC3y8-rFHvwisvxhZ135pogeUm7_kIA69', badge: 'Tutorial' },
    ],
  },
  'state & hooks': {
    videoId: 'O6P86uwfdR0', // Codevolution
    resources: [{ title: 'React Docs: useState', url: 'https://react.dev/reference/react/useState', badge: 'Docs' }],
  },
  'react router': {
    videoId: 'oQxZl2d0H6c', // Traversy
    resources: [{ title: 'Traversy: React Router v6', url: 'https://www.youtube.com/watch?v=oQxZl2d0H6c', badge: 'Tutorial' }],
  },
  'context api': {
    videoId: '5LrDIWkK_Bc', // Codevolution
    resources: [{ title: 'Codevolution: Context API', url: 'https://www.youtube.com/watch?v=5LrDIWkK_Bc', badge: 'Tutorial' }],
  },

  // ── Python (CodeWithHarry & freeCodeCamp) ──────────────────────────────
  'python basics': {
    videoId: 'aqvDxdPZiPg', // CodeWithHarry Hindi
    resources: [
      { title: 'CodeWithHarry: Python Playlist', url: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agwh1XjRt24igEfPzL32th7', badge: 'Tutorial' },
    ],
  },
  'python for beginners': {
    videoId: 'rfscVS0vtbw', // freeCodeCamp English
    resources: [
      { title: 'freeCodeCamp: Python Handbook', url: 'https://www.freecodecamp.org/news/the-python-handbook/', badge: 'freeCodeCamp' },
    ],
  },
  'pandas & numpy': {
    videoId: 'r-uOLxNrNk8', // freeCodeCamp
    resources: [
      { title: 'freeCodeCamp: Data Analysis', url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/', badge: 'freeCodeCamp' },
    ],
  },
  'defining functions': {
    videoId: 'aqvDxdPZiPg', // CodeWithHarry
    resources: [{ title: 'Python: Functions', url: 'https://www.youtube.com/watch?v=aqvDxdPZiPg', badge: 'Tutorial' }],
  },
  'variables and data types': {
    videoId: 'aqvDxdPZiPg', // CodeWithHarry
    resources: [{ title: 'Python: Variables', url: 'https://www.youtube.com/watch?v=aqvDxdPZiPg', badge: 'Tutorial' }],
  },
  'for loops': {
    videoId: 'aqvDxdPZiPg', // CodeWithHarry
    resources: [{ title: 'Python: Loops', url: 'https://www.youtube.com/watch?v=aqvDxdPZiPg', badge: 'Tutorial' }],
  },

  // ── Django (Traversy, Dennis Ivy, Tech with Tim) ────────────────────────
  'django setup': {
    videoId: 'F5mRW0jo-U4', // Traversy
    resources: [{ title: 'Django Docs', url: 'https://docs.djangoproject.com/', badge: 'Docs' }],
  },
  'django rest framework': {
    videoId: 'HXV3zeQKqGY', // Dennis Ivy
    resources: [
      { title: 'Dennis Ivy: DRF Course', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', badge: 'Tutorial' },
    ],
  },
  'django models & mvt': {
    videoId: 'sm1v7NlE0_4', // Tech with Tim
    resources: [{ title: 'Django MVT Pattern', url: 'https://docs.djangoproject.com/en/stable/intro/overview/', badge: 'Docs' }],
  },
  'token authentication': {
    videoId: 'HXV3zeQKqGY', // Dennis Ivy DRF
    resources: [{ title: 'Dennis Ivy: Token Auth', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', badge: 'Tutorial' }],
  },
  'jwt with simplejwt': {
    videoId: 'nu52R54oV1c', // Dennis Ivy JWT
    resources: [{ title: 'Dennis Ivy: JWT Auth', url: 'https://www.youtube.com/watch?v=nu52R54oV1c', badge: 'Tutorial' }],
  },
  'custom user model': {
    videoId: 'eC1f4_X-H54', // Dennis Ivy
    resources: [{ title: 'Dennis Ivy: Custom User', url: 'https://www.youtube.com/watch?v=eC1f4_X-H54', badge: 'Tutorial' }],
  },
  'serializers': {
    videoId: 'HXV3zeQKqGY', // Dennis Ivy
    resources: [{ title: 'Dennis Ivy: Serializers', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', badge: 'Tutorial' }],
  },
  'apiview and viewsets': {
    videoId: 'HXV3zeQKqGY', // Dennis Ivy
    resources: [{ title: 'Dennis Ivy: ViewSets', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', badge: 'Tutorial' }],
  },
  'orm and model definition': {
    videoId: 'F5mRW0jo-U4', // Traversy Django
    resources: [{ title: 'Traversy: Django ORM', url: 'https://www.youtube.com/watch?v=F5mRW0jo-U4', badge: 'Tutorial' }],
  },
  'django project structure': {
    videoId: 'F5mRW0jo-U4', // Traversy Django
    resources: [{ title: 'Traversy: Django Structure', url: 'https://www.youtube.com/watch?v=F5mRW0jo-U4', badge: 'Tutorial' }],
  },
  'docker with django': {
    videoId: 'hP77Rua1E0c', // Tech with Tim
    resources: [{ title: 'Tech with Tim: Docker Django', url: 'https://www.youtube.com/watch?v=hP77Rua1E0c', badge: 'Tutorial' }],
  },
  'django foundations': {
    videoId: 'F5mRW0jo-U4', // Traversy
    resources: [{ title: 'Traversy: Django foundations', url: 'https://www.youtube.com/watch?v=F5mRW0jo-U4', badge: 'Tutorial' }],
  },
  'django admin panel': {
    videoId: 'F5mRW0jo-U4', // Traversy
    resources: [{ title: 'Traversy: Django Admin', url: 'https://www.youtube.com/watch?v=F5mRW0jo-U4', badge: 'Tutorial' }],
  },

  // ── Node.js & Express ─────────────────────────────────────────────────
  'express.js basics': {
    videoId: 'L72fhGm1tfE', // Traversy
    resources: [{ title: 'Express Official Docs', url: 'https://expressjs.com/', badge: 'Docs' }],
  },
  'node.js fundamentals': {
    videoId: 'fBNz5xF-Kx4', // Traversy
    resources: [{ title: 'Node.js Docs', url: 'https://nodejs.org/en/docs/', badge: 'Docs' }],
  },

  // ── DSA ───────────────────────────────────────────────────────────────
  'arrays & strings': {
    videoId: 'pkYVOmU3MgA', // freeCodeCamp
    resources: [{ title: 'freeCodeCamp: DSA Course', url: 'https://www.youtube.com/watch?v=pkYVOmU3MgA', badge: 'Tutorial' }],
  },
  'trees & graphs': {
    videoId: 'tWVWeAqZ0WU',
    resources: [{ title: 'LeetCode Guide', url: 'https://leetcode.com/explore/learn/card/graph/', badge: 'Tutorial' }],
  },

  // ── DevOps & Docker ───────────────────────────────────────────────────
  'docker containers': {
    videoId: 'fqMOX6JJhGo', // TechWorld with Nana
    resources: [{ title: 'Docker Handbook', url: 'https://www.freecodecamp.org/news/the-docker-handbook/', badge: 'freeCodeCamp' }],
  },
};

// ── Course-level fallback videos (Absolute Best Matches) ─────────────────────
export const COURSE_FALLBACK_VIDEOS: Record<string, string> = {
  'frontend-react':     'w7ejDZ8SWv8', // Traversy React
  'backend-nodejs':     'fBNz5xF-Kx4', // Traversy Node
  'fullstack-mern':     'fnpmR6Q5lEc', // EdRoh MERN
  'dsa-interviews':     'pkYVOmU3MgA', // freeCodeCamp DSA
  'nlp':                'rmVRLeJRpdo',
  'machine-learning':   'NWONeJKn9Kc',
  'data-science':       'r-uOLxNrNk8',
  'python-beginners':   'aqvDxdPZiPg', // CodeWithHarry Python (Hindi)
  'flutter':            'jmsN7dn9iWk',
  'react-native':       '0-S5a0eXPoc',
  'android-kotlin':     'cDabx3SjuOY',
  'backend-django':     'F5mRW0jo-U4', // Traversy Django
  'frontend-vue':       'FXpIoQ_rT_c',
  'docker-kubernetes':  'fqMOX6JJhGo',
  'cybersecurity':      'a03XHaG26L8',
  'blockchain':         'ipwxYa-F1uY',
  'javascript-mastery': 'PkZNo7MFNFg',
  'devops-aws':         'ulprqHHWlng',
};

/** Look up resources for a topic title. Falls back to null if not found. */
export function getTopicResource(topicTitle: string): TopicResource | null {
  const key = topicTitle.toLowerCase().trim();
  
  // 1. Exact match (highest priority)
  if (RAW[key]) return RAW[key];
  
  // 2. Contains match (e.g. "Practical Django Setup" matches "django setup")
  for (const k of Object.keys(RAW)) {
    if (key.includes(k)) return RAW[k];
  }
  
  // 3. Substring match (e.g. "Django" matches "django setup")
  // Only if the key is descriptive enough (length > 4)
  for (const k of Object.keys(RAW)) {
    if (k.length > 4 && k.includes(key)) return RAW[k];
  }

  return null;
}

/** Get fallback video ID for a course slug */
export function getCourseVideo(courseId: string): string {
  const normalizedId = courseId.replace(/_/g, '-');
  return COURSE_FALLBACK_VIDEOS[normalizedId] || 'dQw4w9WgXcQ';
}
