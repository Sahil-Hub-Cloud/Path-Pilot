export interface ResourceLink {
  title: string;
  url: string;
  badge: 'MDN' | 'Docs' | 'freeCodeCamp' | 'Guide' | 'Tutorial' | 'GFG' | 'GitHub';
}

const defaultPythonResources: ResourceLink[] = [
  { title: 'Python Official Documentation', url: 'https://docs.python.org/3/', badge: 'Docs' },
  { title: 'GeeksforGeeks Python Tutorial', url: 'https://www.geeksforgeeks.org/python-programming-language/', badge: 'GFG' },
  { title: 'Python Examples on GitHub', url: 'https://github.com/TheAlgorithms/Python', badge: 'GitHub' }
];

export const TOPIC_RESOURCES: Record<string, ResourceLink[]> = {
  // Python Beginners
  'topic-01': defaultPythonResources,
  'topic-02': defaultPythonResources,
  'topic-03': defaultPythonResources,
  'topic-04': defaultPythonResources,
  'topic-05': defaultPythonResources,
  'topic-06': defaultPythonResources,
  'topic-07': defaultPythonResources,
  'topic-08': defaultPythonResources,
  'topic-09': defaultPythonResources,
  'topic-10': defaultPythonResources,
  'topic-11': defaultPythonResources,
  'topic-12': defaultPythonResources,
  'topic-13': defaultPythonResources,
  'topic-14': defaultPythonResources,
  'topic-15': defaultPythonResources,
  'topic-16': defaultPythonResources,
  'topic-17': defaultPythonResources,
  'topic-18': defaultPythonResources,
  'topic-19': defaultPythonResources,
  'topic-20': defaultPythonResources,
  'topic-21': defaultPythonResources,
  'topic-22': defaultPythonResources,
  'topic-23': defaultPythonResources,
  'topic-24': defaultPythonResources,
  'topic-25': defaultPythonResources,
};
