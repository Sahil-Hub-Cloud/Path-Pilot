export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'missed';
  dueDate?: string; // ISO date
  estimatedHours: number;
  prerequisites?: string[]; // IDs of other tasks
}

export interface Roadmap {
  id: string;
  studentId: string;
  title: string; // e.g., "Semester 5 Plan"
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  degree: string; // e.g., "B.Tech"
  year: number;
  skills: string[]; // List of mastered skills
  goals: string[]; // e.g., "Get an Internship"
  availability: Record<string, number>; // "Monday": 3 (hours)
  referralCode?: string; // Optional referral tracking
}

const STORAGE_KEYS = {
  PROFILE: 'pathpilot_profile',
  ROADMAP: 'pathpilot_roadmap',
};

export class Storage {
  static getProfile(): StudentProfile | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing profile from storage:", e);
      return null;
    }
  }

  static saveProfile(profile: StudentProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  static getRoadmap(): Roadmap | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.ROADMAP);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing roadmap from storage:", e);
      return null;
    }
  }

  static saveRoadmap(roadmap: Roadmap): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmap));
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.ROADMAP);
  }
}
