export interface ResourceLink {
  title: string;
  url: string;
  badge: 'MDN' | 'Docs' | 'freeCodeCamp' | 'Guide' | 'Tutorial';
}

export interface TopicResource {
  videoId: string;
  resources: ResourceLink[];
}

// Keyed by lowercase topic title for fuzzy lookup
const RAW: Record<string, TopicResource> = {
  // ── HTML & CSS ────────────────────────────────────────────────────────
  'semantic html': {
    videoId: 'kUMe1FH4CHE',
    resources: [
      { title: 'MDN: HTML elements reference', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element', badge: 'MDN' },
      { title: 'freeCodeCamp: Semantic HTML Guide', url: 'https://www.freecodecamp.org/news/semantic-html5-elements/', badge: 'freeCodeCamp' },
      { title: 'W3C HTML Living Standard', url: 'https://html.spec.whatwg.org/', badge: 'Docs' },
    ],
  },
  'flexbox & grid': {
    videoId: 'OXGznpKZ_sA',
    resources: [
      { title: 'MDN: CSS Flexbox', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox', badge: 'MDN' },
      { title: 'MDN: CSS Grid', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout', badge: 'MDN' },
      { title: 'CSS Tricks: Complete Guide to Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', badge: 'Guide' },
    ],
  },
  'responsive design': {
    videoId: 'srvUrASNj0s',
    resources: [
      { title: 'MDN: Responsive Design', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design', badge: 'MDN' },
      { title: 'freeCodeCamp: Responsive Web Design', url: 'https://www.freecodecamp.org/learn/responsive-web-design/', badge: 'freeCodeCamp' },
    ],
  },
  'css animations': {
    videoId: 'YszONjKpgg4',
    resources: [
      { title: 'MDN: CSS Animations', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations', badge: 'MDN' },
      { title: 'MDN: Using CSS Transitions', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions', badge: 'MDN' },
    ],
  },
  // ── JavaScript ────────────────────────────────────────────────────────
  'es6+ syntax': {
    videoId: 'NCwa_xi0Uuc',
    resources: [
      { title: 'MDN: JavaScript Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference', badge: 'MDN' },
      { title: 'freeCodeCamp: ES6 Guide', url: 'https://www.freecodecamp.org/news/write-less-do-more-with-javascript-es6-5fd4a8e50ee2/', badge: 'freeCodeCamp' },
    ],
  },
  'dom manipulation': {
    videoId: '5fb2aPlgoys',
    resources: [
      { title: 'MDN: DOM Introduction', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction', badge: 'MDN' },
      { title: 'freeCodeCamp: DOM Manipulation', url: 'https://www.freecodecamp.org/news/javascript-dom-manipulation/', badge: 'freeCodeCamp' },
    ],
  },
  'async/await': {
    videoId: 'V_Kr9OSfDeU',
    resources: [
      { title: 'MDN: async/await', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises', badge: 'MDN' },
      { title: 'freeCodeCamp: Async JS Guide', url: 'https://www.freecodecamp.org/news/asynchronous-javascript/', badge: 'freeCodeCamp' },
    ],
  },
  'closures & scope': {
    videoId: '6Ixyltr8_R0',
    resources: [
      { title: 'MDN: Closures', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures', badge: 'MDN' },
      { title: 'MDN: var, let, const', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types', badge: 'MDN' },
    ],
  },
  // ── React ────────────────────────────────────────────────────────────
  'components & props': {
    videoId: 'w7ejDZ8SWv8',
    resources: [
      { title: 'React Docs: Components & Props', url: 'https://react.dev/learn/passing-props-to-a-component', badge: 'Docs' },
      { title: 'freeCodeCamp: React Props', url: 'https://www.freecodecamp.org/news/react-props/', badge: 'freeCodeCamp' },
    ],
  },
  'state & hooks': {
    videoId: 'O6P86uwfdR0',
    resources: [
      { title: 'React Docs: useState', url: 'https://react.dev/reference/react/useState', badge: 'Docs' },
      { title: 'React Docs: useEffect', url: 'https://react.dev/reference/react/useEffect', badge: 'Docs' },
      { title: 'freeCodeCamp: React Hooks', url: 'https://www.freecodecamp.org/news/react-hooks-cheatsheet/', badge: 'freeCodeCamp' },
    ],
  },
  // ── Node.js & Backend ─────────────────────────────────────────────────
  'modules & npm': {
    videoId: 'fBNz5xF-Kx4',
    resources: [
      { title: 'Node.js Docs: Modules', url: 'https://nodejs.org/docs/latest/api/modules.html', badge: 'Docs' },
      { title: 'npm Docs', url: 'https://docs.npmjs.com/', badge: 'Docs' },
    ],
  },
  'express.js': {
    videoId: 'L72fhGm1tfE',
    resources: [
      { title: 'Express Official Docs', url: 'https://expressjs.com/', badge: 'Docs' },
      { title: 'freeCodeCamp: Express.js Tutorial', url: 'https://www.freecodecamp.org/news/free-8-hour-node-express-course/', badge: 'freeCodeCamp' },
    ],
  },
  'rest design': {
    videoId: '-MTSQjw5DrM',
    resources: [
      { title: 'MDN: HTTP Overview', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview', badge: 'MDN' },
      { title: 'freeCodeCamp: REST API Guide', url: 'https://www.freecodecamp.org/news/rest-api-tutorial-rest-client-rest-service-and-api-calls-explained-with-code-examples/', badge: 'freeCodeCamp' },
    ],
  },
  'jwt & oauth': {
    videoId: '7Q17ubqLfaM',
    resources: [
      { title: 'JWT.io Introduction', url: 'https://jwt.io/introduction', badge: 'Docs' },
      { title: 'freeCodeCamp: JWT Auth', url: 'https://www.freecodecamp.org/news/securing-node-js-restful-apis-with-json-web-tokens/', badge: 'freeCodeCamp' },
    ],
  },
  // ── Databases ─────────────────────────────────────────────────────────
  'sql fundamentals': {
    videoId: 'HXV3zeQKqGY',
    resources: [
      { title: 'SQLite Docs', url: 'https://www.sqlite.org/docs.html', badge: 'Docs' },
      { title: 'freeCodeCamp: SQL Tutorial', url: 'https://www.freecodecamp.org/news/sql-and-databases-full-course/', badge: 'freeCodeCamp' },
    ],
  },
  'mongodb': {
    videoId: 'c2M-rlkkT5o',
    resources: [
      { title: 'MongoDB Official Docs', url: 'https://www.mongodb.com/docs/', badge: 'Docs' },
      { title: 'freeCodeCamp: MongoDB Tutorial', url: 'https://www.freecodecamp.org/news/learn-mongodb-a4ce205e7739/', badge: 'freeCodeCamp' },
    ],
  },
  // ── DSA ───────────────────────────────────────────────────────────────
  'two pointers': {
    videoId: 'On03HWe2tZM',
    resources: [
      { title: 'LeetCode Two Pointers Tag', url: 'https://leetcode.com/tag/two-pointers/', badge: 'Tutorial' },
      { title: 'freeCodeCamp: Two Pointer Technique', url: 'https://www.freecodecamp.org/news/two-pointer-technique/', badge: 'freeCodeCamp' },
    ],
  },
  'bfs & dfs': {
    videoId: 'tWVWeAqZ0WU',
    resources: [
      { title: 'freeCodeCamp: Graph Algorithms', url: 'https://www.freecodecamp.org/news/graph-algorithms-and-data-structures-explained-with-java-and-c-examples/', badge: 'freeCodeCamp' },
      { title: 'LeetCode Graph Problems', url: 'https://leetcode.com/tag/graph/', badge: 'Tutorial' },
    ],
  },
  'memoisation': {
    videoId: 'oBt53YbR9Kk',
    resources: [
      { title: 'freeCodeCamp: Dynamic Programming', url: 'https://www.freecodecamp.org/news/demystifying-dynamic-programming-3efafb8d4296/', badge: 'freeCodeCamp' },
      { title: 'MDN: Closures for Memoization', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures', badge: 'MDN' },
    ],
  },
  // ── Python ────────────────────────────────────────────────────────────
  'variables & types': {
    videoId: 'rfscVS0vtbw',
    resources: [
      { title: 'Python Official Docs', url: 'https://docs.python.org/3/', badge: 'Docs' },
      { title: 'freeCodeCamp: Python for Beginners', url: 'https://www.freecodecamp.org/news/the-python-handbook/', badge: 'freeCodeCamp' },
    ],
  },
  'numpy & pandas': {
    videoId: 'r-uOLxNrNk8',
    resources: [
      { title: 'NumPy Official Docs', url: 'https://numpy.org/doc/', badge: 'Docs' },
      { title: 'Pandas Official Docs', url: 'https://pandas.pydata.org/docs/', badge: 'Docs' },
      { title: 'freeCodeCamp: Data Analysis with Python', url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/', badge: 'freeCodeCamp' },
    ],
  },
  // ── Flutter ───────────────────────────────────────────────────────────
  'stateless vs stateful': {
    videoId: 'jmsN7dn9iWk',
    resources: [
      { title: 'Flutter Docs: Widget Catalog', url: 'https://docs.flutter.dev/ui/widgets', badge: 'Docs' },
      { title: 'Flutter Docs: State Management', url: 'https://docs.flutter.dev/data-and-backend/state-mgmt/intro', badge: 'Docs' },
    ],
  },
  'provider': {
    videoId: 'O81DyjsSaK0',
    resources: [
      { title: 'Provider Package Docs', url: 'https://pub.dev/packages/provider', badge: 'Docs' },
      { title: 'Flutter Docs: Simple App State', url: 'https://docs.flutter.dev/data-and-backend/state-mgmt/simple', badge: 'Docs' },
    ],
  },
  // ── Docker & DevOps ───────────────────────────────────────────────────
  'docker basics': {
    videoId: 'fqMOX6JJhGo',
    resources: [
      { title: 'Docker Official Docs', url: 'https://docs.docker.com/', badge: 'Docs' },
      { title: 'freeCodeCamp: Docker Tutorial', url: 'https://www.freecodecamp.org/news/the-docker-handbook/', badge: 'freeCodeCamp' },
    ],
  },
  'github actions': {
    videoId: 'R8_veQiYBjI',
    resources: [
      { title: 'GitHub Actions Docs', url: 'https://docs.github.com/en/actions', badge: 'Docs' },
      { title: 'freeCodeCamp: GitHub Actions Guide', url: 'https://www.freecodecamp.org/news/what-are-github-actions-and-how-can-you-automate-tests-and-slack-notifications/', badge: 'freeCodeCamp' },
    ],
  },
  // ── AWS ───────────────────────────────────────────────────────────────
  'ec2 & vpc': {
    videoId: 'ulprqHHWlng',
    resources: [
      { title: 'AWS EC2 Docs', url: 'https://docs.aws.amazon.com/ec2/', badge: 'Docs' },
      { title: 'freeCodeCamp: AWS Certified Cloud Practitioner', url: 'https://www.freecodecamp.org/news/aws-certified-cloud-practitioner-certification-study-course-pass-the-exam/', badge: 'freeCodeCamp' },
    ],
  },
  // ── Machine Learning ──────────────────────────────────────────────────
  'neural networks': {
    videoId: 'aircAruvnKk',
    resources: [
      { title: 'PyTorch Docs', url: 'https://pytorch.org/docs/stable/index.html', badge: 'Docs' },
      { title: 'freeCodeCamp: Deep Learning', url: 'https://www.freecodecamp.org/news/deep-learning-crash-course-learn-the-key-concepts/', badge: 'freeCodeCamp' },
    ],
  },
  // ── Kotlin / Android ──────────────────────────────────────────────────
  'jetpack compose': {
    videoId: 'cDabx3SjuOY',
    resources: [
      { title: 'Jetpack Compose Docs', url: 'https://developer.android.com/jetpack/compose/documentation', badge: 'Docs' },
      { title: 'Android Developers: Compose Tutorial', url: 'https://developer.android.com/jetpack/compose/tutorial', badge: 'Tutorial' },
    ],
  },
  // ── Cybersecurity ─────────────────────────────────────────────────────
  'owasp top 10': {
    videoId: 'a03XHaG26L8',
    resources: [
      { title: 'OWASP Top 10 Official', url: 'https://owasp.org/Top10/', badge: 'Docs' },
      { title: 'freeCodeCamp: Web Security Guide', url: 'https://www.freecodecamp.org/news/web-security-an-introduction-to-http-security-headers-and-their-role-in-web-security/', badge: 'freeCodeCamp' },
    ],
  },
  // ── Blockchain ────────────────────────────────────────────────────────
  'solidity': {
    videoId: 'ipwxYa-F1uY',
    resources: [
      { title: 'Solidity Docs', url: 'https://docs.soliditylang.org/', badge: 'Docs' },
      { title: 'freeCodeCamp: Solidity Tutorial', url: 'https://www.freecodecamp.org/news/learn-solidity-blockchain-and-smart-contracts-in-a-free/', badge: 'freeCodeCamp' },
    ],
  },
};

// ── Course-level fallback videos ─────────────────────────────────────────────
export const COURSE_FALLBACK_VIDEOS: Record<string, string> = {
  'frontend-react':     'w7ejDZ8SWv8',
  'backend-nodejs':     'fBNz5xF-Kx4',
  'fullstack-mern':     'fnpmR6Q5lEc',
  'dsa-interviews':     'pkYVOmU3MgA',
  'nlp':                'rmVRLeJRpdo',
  'machine-learning':   'NWONeJKn9Kc',
  'data-science':       'r-uOLxNrNk8',
  'python-beginners':   'rfscVS0vtbw',
  'flutter':            'jmsN7dn9iWk',
  'react-native':       '0-S5a0eXPoc',
  'android-kotlin':     'cDabx3SjuOY',
  'backend-django':     'F5mRW0jo-U4',
  'frontend-vue':       'FXpIoQ_rT_c',
  'docker-kubernetes':  'fqMOX6JJhGo',
  'cybersecurity':      'a03XHaG26L8',
  'blockchain':         'ipwxYa-F1uY',
  'javascript-mastery': 'PkZNo7MFNFg',
  'devops-aws':         'ulprqHHWlng',
};

/** Look up resources for a topic title. Falls back to empty if not found. */
export function getTopicResource(topicTitle: string): TopicResource | null {
  const key = topicTitle.toLowerCase().trim();
  // Exact match
  if (RAW[key]) return RAW[key];
  // Partial match — find first key that is a substring of the title or vice versa
  for (const k of Object.keys(RAW)) {
    if (key.includes(k) || k.includes(key)) return RAW[k];
  }
  return null;
}

/** Get fallback video ID for a course slug */
export function getCourseVideo(courseId: string): string {
  return COURSE_FALLBACK_VIDEOS[courseId] || 'dQw4w9WgXcQ';
}
