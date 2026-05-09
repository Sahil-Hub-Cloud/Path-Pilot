/**
 * PATH PILOT — CENTRAL COURSE REGISTRY
 * Single source of truth for all 18 courses.
 * courseId = URL slug used in /learn/[courseId]
 */

export interface CourseEntry {
  courseId: string;      // URL slug, e.g. 'flutter'
  roadmapKey: string;    // key in ROADMAPS record
  label: string;         // human-readable name stored in Firestore learningPath
  emoji: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  trackIds: string[];    // onboarding track ids that map here
}

export const COURSES: CourseEntry[] = [
  {
    courseId: 'frontend-react',
    roadmapKey: 'frontend-react',
    label: 'Frontend Dev',
    emoji: '⚛️',
    duration: '12 weeks',
    level: 'beginner',
    trackIds: ['frontend'],
  },
  {
    courseId: 'backend-nodejs',
    roadmapKey: 'backend-nodejs',
    label: 'Backend Dev',
    emoji: '🚀',
    duration: '12 weeks',
    level: 'beginner',
    trackIds: ['backend'],
  },
  {
    courseId: 'fullstack-mern',
    roadmapKey: 'fullstack-mern',
    label: 'MERN Stack',
    emoji: '📚',
    duration: '16 weeks',
    level: 'intermediate',
    trackIds: ['mern'],
  },
  {
    courseId: 'dsa-interviews',
    roadmapKey: 'dsa-interviews',
    label: 'DSA & Interviews',
    emoji: '🧠',
    duration: '16 weeks',
    level: 'intermediate',
    trackIds: ['dsa'],
  },
  {
    courseId: 'nlp',
    roadmapKey: 'nlp',
    label: 'AI Engineering',
    emoji: '💬',
    duration: '14 weeks',
    level: 'intermediate',
    trackIds: ['ai', 'prompt'],
  },
  {
    courseId: 'machine-learning',
    roadmapKey: 'machine-learning',
    label: 'Machine Learning',
    emoji: '🤖',
    duration: '16 weeks',
    level: 'intermediate',
    trackIds: ['ml'],
  },
  {
    courseId: 'data-science',
    roadmapKey: 'data-science',
    label: 'Data Science',
    emoji: '📊',
    duration: '12 weeks',
    level: 'beginner',
    trackIds: ['data-science'],
  },
  {
    courseId: 'python-beginners',
    roadmapKey: 'python-beginners',
    label: 'Python Beginners',
    emoji: '🐍',
    duration: '6 weeks',
    level: 'beginner',
    trackIds: ['python'],
  },
  {
    courseId: 'flutter',
    roadmapKey: 'flutter',
    label: 'Flutter / Cross-Platform',
    emoji: '🦋',
    duration: '12 weeks',
    level: 'beginner',
    trackIds: ['flutter'],
  },
  {
    courseId: 'react-native',
    roadmapKey: 'react-native',
    label: 'React Native',
    emoji: '📱',
    duration: '10 weeks',
    level: 'intermediate',
    trackIds: ['ios'],
  },
  {
    courseId: 'android-kotlin',
    roadmapKey: 'android-kotlin',
    label: 'Android Dev',
    emoji: '🤖',
    duration: '14 weeks',
    level: 'beginner',
    trackIds: ['android'],
  },
  {
    courseId: 'backend-django',
    roadmapKey: 'backend-django',
    label: 'Backend Django',
    emoji: '🐍',
    duration: '12 weeks',
    level: 'intermediate',
    trackIds: ['django'],
  },
  {
    courseId: 'frontend-vue',
    roadmapKey: 'frontend-vue',
    label: 'Frontend Vue',
    emoji: '🟢',
    duration: '10 weeks',
    level: 'beginner',
    trackIds: ['vue'],
  },
  {
    courseId: 'docker-kubernetes',
    roadmapKey: 'docker-kubernetes',
    label: 'Cloud & DevOps',
    emoji: '🐳',
    duration: '8 weeks',
    level: 'intermediate',
    trackIds: ['cloud'],
  },
  {
    courseId: 'cybersecurity',
    roadmapKey: 'cybersecurity',
    label: 'Cybersecurity',
    emoji: '🔐',
    duration: '12 weeks',
    level: 'beginner',
    trackIds: ['cyber', 'cloudsec'],
  },
  {
    courseId: 'blockchain',
    roadmapKey: 'blockchain',
    label: 'Blockchain Dev',
    emoji: '⛓️',
    duration: '14 weeks',
    level: 'advanced',
    trackIds: ['blockchain'],
  },
  {
    courseId: 'javascript-mastery',
    roadmapKey: 'javascript-mastery',
    label: 'JavaScript Mastery',
    emoji: '🟨',
    duration: '8 weeks',
    level: 'advanced',
    trackIds: ['javascript'],
  },
  {
    courseId: 'devops-aws',
    roadmapKey: 'devops-aws',
    label: 'DevOps with AWS',
    emoji: '☁️',
    duration: '12 weeks',
    level: 'intermediate',
    trackIds: ['aws'],
  },
];

/** Map a Firestore learningPath label → courseId URL slug */
export function getCourseIdFromLabel(label: string | null | undefined): string {
  if (!label) return 'frontend-react';
  const p = label.toLowerCase();
  const match = COURSES.find(c =>
    c.trackIds.some(t => p.includes(t)) ||
    p.includes(c.courseId) ||
    p.includes(c.label.toLowerCase())
  );
  return match?.courseId ?? 'frontend-react';
}

/** Map an onboarding trackId → courseId URL slug */
export function getCourseIdFromTrack(trackId: string): string {
  const match = COURSES.find(c => c.trackIds.includes(trackId));
  return match?.courseId ?? 'frontend-react';
}

/** Map a courseId URL slug → roadmapKey (same in our new schema) */
export function getRoadmapKey(courseId: string): string {
  return courseId; // 1:1 in new schema
}
