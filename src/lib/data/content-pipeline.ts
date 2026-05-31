/**
 * Content pipeline — builds per-topic video & resource maps from all roadmaps.
 * Keys use global topic IDs (topic_1 … topic_N).
 */
import { ROADMAPS, type Roadmap } from './roadmaps';

export interface ResourceLink {
  title: string;
  url: string;
  badge: 'MDN' | 'Docs' | 'freeCodeCamp' | 'Guide' | 'Tutorial' | 'GFG' | 'GitHub';
}

export interface TopicVideoMap {
  telugu?: string;
  hindi?: string;
  english?: string;
}

export interface CourseVideoPool {
  english: string;
  hindi: string;
  telugu: string;
}

const DEFAULT_POOL: CourseVideoPool = {
  english: '',
  hindi: '',
  telugu: '',
};

/** Per-course YouTube video IDs for tri-lingual toggles */
export const COURSE_VIDEO_POOLS: Record<string, CourseVideoPool> = {
  'python-beginners': { english: 'rfscVS0vtbw', hindi: 'aqvDxdPZiPg', telugu: 'kqtD5dpn9C8' },
  'javascript-mastery': { english: 'PkZNo7MFNFg', hindi: 'Vl0H5V7Z59E', telugu: '' },
  'frontend-react': { english: 'w7ejDZ8SWv8', hindi: 'O6P86uwfdR0', telugu: '' },
  'frontend-vue': { english: 'FXpIoQ_rT_c', hindi: 'O6P86uwfdR0', telugu: '' },
  'backend-nodejs': { english: 'fBNz5xF-Kx4', hindi: 'L72fhGm1tfE', telugu: '' },
  'backend-django': { english: 'F5mRW0jo-U4', hindi: 'HXV3zeQKqGY', telugu: '' },
  'fullstack-mern': { english: 'fnpmR6Q5lEc', hindi: 'w7ejDZ8SWv8', telugu: '' },
  'dsa-interviews': { english: 'pkYVOmU3MgA', hindi: '5rGMsR9P9gE', telugu: '' },
  'nlp': { english: 'rmVRLeJRpdo', hindi: 'rmVRLeJRpdo', telugu: '' },
  'machine-learning': { english: 'NWONeJKn9Kc', hindi: '1vsmaEfd9JA', telugu: '' },
  'data-science': { english: 'r-uOLxNrNk8', hindi: 'r-uOLxNrNk8', telugu: '' },
  'flutter': { english: 'cM535T5o1sE', hindi: 'jmsN7dn9iWk', telugu: '' },
  'react-native': { english: '0-S5a0eXPoc', hindi: '0-S5a0eXPoc', telugu: '' },
  'android-kotlin': { english: 'cDabx3SjuOY', hindi: 'cDabx3SjuOY', telugu: '' },
  'docker-kubernetes': { english: 'fqMOX6JJhGo', hindi: 'fqMOX6JJhGo', telugu: '' },
  'devops-aws': { english: 'ulprqHHWlng', hindi: 'ulprqHHWlng', telugu: '' },
  'cybersecurity': { english: 'a03XHaG26L8', hindi: 'a03XHaG26L8', telugu: '' },
  'blockchain': { english: 'ipwxYa-F1uY', hindi: 'ipwxYa-F1uY', telugu: '' },
  'ai-ml-engineer': { english: 'NWONeJKn9Kc', hindi: '1vsmaEfd9JA', telugu: '' },
  'data-engineering': { english: 'r-uOLxNrNk8', hindi: 'r-uOLxNrNk8', telugu: '' },
  'web3-pro': { english: 'ipwxYa-F1uY', hindi: 'ipwxYa-F1uY', telugu: '' },
  'cloud-native': { english: 'fqMOX6JJhGo', hindi: 'fqMOX6JJhGo', telugu: '' },
};

interface CourseResourceTemplate {
  docsUrl: string;
  githubUrl: string;
  badge: ResourceLink['badge'];
}

const DEFAULT_RESOURCE_TEMPLATE: CourseResourceTemplate = {
  docsUrl: 'https://developer.mozilla.org',
  githubUrl: 'https://github.com/topics/programming',
  badge: 'Docs',
};

const COURSE_RESOURCE_TEMPLATES: Record<string, CourseResourceTemplate> = {
  'python-beginners': { docsUrl: 'https://docs.python.org/3/', githubUrl: 'https://github.com/TheAlgorithms/Python', badge: 'Docs' },
  'javascript-mastery': { docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', githubUrl: 'https://github.com/getify/You-Dont-Know-JS', badge: 'MDN' },
  'frontend-react': { docsUrl: 'https://react.dev/learn', githubUrl: 'https://github.com/facebook/react', badge: 'Docs' },
  'frontend-vue': { docsUrl: 'https://vuejs.org/guide/introduction.html', githubUrl: 'https://github.com/vuejs/vue', badge: 'Docs' },
  'backend-nodejs': { docsUrl: 'https://nodejs.org/en/docs/', githubUrl: 'https://github.com/goldbergyoni/nodebestpractices', badge: 'Docs' },
  'backend-django': { docsUrl: 'https://docs.djangoproject.com/', githubUrl: 'https://github.com/django/django', badge: 'Docs' },
  'fullstack-mern': { docsUrl: 'https://www.mongodb.com/docs/', githubUrl: 'https://github.com/mongodb-developer/mern-stack-example', badge: 'Docs' },
  'dsa-interviews': { docsUrl: 'https://leetcode.com/explore/', githubUrl: 'https://github.com/TheAlgorithms/JavaScript', badge: 'GFG' },
  'nlp': { docsUrl: 'https://huggingface.co/docs', githubUrl: 'https://github.com/huggingface/transformers', badge: 'Docs' },
  'machine-learning': { docsUrl: 'https://scikit-learn.org/stable/', githubUrl: 'https://github.com/scikit-learn/scikit-learn', badge: 'Docs' },
  'data-science': { docsUrl: 'https://pandas.pydata.org/docs/', githubUrl: 'https://github.com/pandas-dev/pandas', badge: 'Docs' },
  'flutter': { docsUrl: 'https://docs.flutter.dev/', githubUrl: 'https://github.com/flutter/flutter', badge: 'Docs' },
  'react-native': { docsUrl: 'https://reactnative.dev/docs/getting-started', githubUrl: 'https://github.com/facebook/react-native', badge: 'Docs' },
  'android-kotlin': { docsUrl: 'https://developer.android.com/kotlin', githubUrl: 'https://github.com/android/compose-samples', badge: 'Docs' },
  'docker-kubernetes': { docsUrl: 'https://docs.docker.com/', githubUrl: 'https://github.com/kubernetes/kubernetes', badge: 'Docs' },
  'devops-aws': { docsUrl: 'https://docs.aws.amazon.com/', githubUrl: 'https://github.com/aws-samples', badge: 'Docs' },
  'cybersecurity': { docsUrl: 'https://owasp.org/www-project-top-ten/', githubUrl: 'https://github.com/OWASP/CheatSheetSeries', badge: 'Docs' },
  'blockchain': { docsUrl: 'https://ethereum.org/en/developers/docs/', githubUrl: 'https://github.com/ethereum/solidity', badge: 'Docs' },
  'ai-ml-engineer': { docsUrl: 'https://pytorch.org/docs/stable/', githubUrl: 'https://github.com/huggingface/transformers', badge: 'Docs' },
  'data-engineering': { docsUrl: 'https://spark.apache.org/docs/latest/', githubUrl: 'https://github.com/apache/airflow', badge: 'Docs' },
  'web3-pro': { docsUrl: 'https://docs.soliditylang.org/', githubUrl: 'https://github.com/OpenZeppelin/openzeppelin-contracts', badge: 'Docs' },
  'cloud-native': { docsUrl: 'https://kubernetes.io/docs/home/', githubUrl: 'https://github.com/kubernetes/community', badge: 'Docs' },
};

export function extractYoutubeId(url?: string): string | undefined {
  if (!url) return undefined;
  const match = url.match(/embed\/([a-zA-Z0-9_-]+)|watch\?v=([a-zA-Z0-9_-]+)|youtu\.be\/([a-zA-Z0-9_-]+)/);
  return match?.[1] || match?.[2] || match?.[3];
}

function buildResourcesForTopic(topicTitle: string, courseId: string): ResourceLink[] {
  const tpl = COURSE_RESOURCE_TEMPLATES[courseId] || DEFAULT_RESOURCE_TEMPLATE;
  const q = encodeURIComponent(topicTitle);
  return [
    { title: `${topicTitle} — Official Docs`, url: tpl.docsUrl, badge: tpl.badge === 'MDN' ? 'MDN' : 'Docs' },
    { title: `GeeksforGeeks: ${topicTitle}`, url: `https://www.geeksforgeeks.org/search/?q=${q}`, badge: 'GFG' },
    { title: `${topicTitle} on GitHub`, url: tpl.githubUrl, badge: 'GitHub' },
  ];
}

const COURSE_PLACEHOLDERS = new Set([
  'aqvDxdPZiPg', // Python beginners placeholder
  'PkZNo7MFNFg', // Javascript mastery placeholder
  'w7ejDZ8SWv8', // React beginners placeholder
  'F5mRW0jo-U4', // Django placeholder
  'pkYVOmU3MgA', // DSA placeholder
  'NWONeJKn9Kc', // ML placeholder
  'jmsN7dn9iWk', // Flutter placeholder
]);

function buildMapsFromRoadmaps(roadmaps: Record<string, Roadmap>) {
  const videos: Record<string, TopicVideoMap> = {};
  const resources: Record<string, ResourceLink[]> = {};

  for (const [courseId, roadmap] of Object.entries(roadmaps)) {
    for (const chapter of roadmap.chapters) {
      for (const topic of chapter.topics) {
        // Only store a video when the roadmap has a genuine topic-specific URL.
        // Falling back to the course pool video causes ALL topics in a course to
        // show the same intro video (e.g., every Flutter topic showing cM535T5o1sE).
        const extracted = extractYoutubeId(topic.videoUrl);
        const fromUrl = extracted && !COURSE_PLACEHOLDERS.has(extracted) ? extracted : undefined;

        if (fromUrl) {
          videos[topic.id] = {
            english: fromUrl,
            hindi:   fromUrl,
            telugu:  fromUrl,
          };
        }
        // If no specific video, leave videos[topic.id] undefined so TopicPanel
        // falls through to the YouTube search embed automatically.

        resources[topic.id] = buildResourcesForTopic(topic.title, courseId);
      }
    }
  }

  return { videos, resources };
}

const built = buildMapsFromRoadmaps(ROADMAPS);

export const TOPIC_VIDEOS: Record<string, TopicVideoMap> = built.videos;
export const TOPIC_RESOURCES: Record<string, ResourceLink[]> = built.resources;

export type VideoLanguage = 'english' | 'hindi' | 'telugu';

export function getTopicVideoId(
  topicId: string,
  courseId: string,
  language: VideoLanguage,
  roadmapVideoUrl?: string
): string | undefined {
  // 1. Check topic-specific video map (only populated from genuine topic.videoUrl)
  const entry = TOPIC_VIDEOS[topicId];
  if (entry) {
    const specific = entry[language] || entry.english;
    if (specific) return specific;
  }

  // 2. Check the roadmap videoUrl directly (passed from the topic data)
  const fromRoadmap = extractYoutubeId(roadmapVideoUrl);
  if (fromRoadmap && !COURSE_PLACEHOLDERS.has(fromRoadmap)) return fromRoadmap;

  // 3. Return undefined — TopicPanel will show a topic-specific YouTube search embed
  return undefined;
}

export function getTopicResourcesForId(topicId: string): ResourceLink[] {
  return TOPIC_RESOURCES[topicId] || [];
}

/** Resolve topic title + course name from roadmaps (for challenge API / labs). */
export function getTopicMeta(
  courseId: string,
  topicId: string
): { topicName: string; courseName: string } | null {
  const roadmap = ROADMAPS[courseId];
  if (!roadmap) return null;
  for (const chapter of roadmap.chapters) {
    const topic = chapter.topics.find((t) => t.id === topicId);
    if (topic) return { topicName: topic.title, courseName: roadmap.title };
  }
  return null;
}
