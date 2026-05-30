export interface LabTest {
  label: string;
  input: string;
  expected: string;
}

export interface LabDef {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xp: number;
  defaultLang: string;
  problem: string;
  expected: string;
  tests: LabTest[];
  hint: string;
  courseId?: string;
}
