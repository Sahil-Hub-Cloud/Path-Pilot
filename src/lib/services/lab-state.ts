import { supabase } from '../supabase';

export interface LabState {
    student_id: string;
    code_content?: string;
    terminal_history?: any[];
    file_system_state?: any;
    last_updated?: string;
}

export class LabStateService {
    private static STORAGE_KEY = 'pathpilot_lab_cache';

    /**
     * Save the current state of a lab (code or terminal).
     */
    static async saveState(studentId: string, state: Partial<LabState>): Promise<void> {
        if (!studentId || studentId === 'guest') return;

        // 1. Local Cache Fallback (Always update)
        try {
            const cache = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
            cache[studentId] = { ...cache[studentId], ...state, last_updated: new Date().toISOString() };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache));
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }

        // 2. Supabase Primary
        try {
            const { error } = await supabase
                .from('lab_state')
                .upsert({
                    student_id: studentId,
                    ...state,
                    last_updated: new Date().toISOString()
                });

            if (error) throw error;
        } catch (error) {
            console.warn('Supabase save failed (falling back to locally cached state):', error);
        }
    }

    /**
     * Load the saved state for a student.
     */
    static async loadState(studentId: string): Promise<LabState | null> {
        if (!studentId || studentId === 'guest') return null;

        // 1. Try Supabase
        try {
            const { data, error } = await supabase
                .from('lab_state')
                .select('*')
                .eq('student_id', studentId)
                .maybeSingle();

            if (!error && data) return data;
            if (error && error.code !== 'PGRST116') {
                console.warn('Supabase load error, checking local cache:', error);
            }
        } catch (error) {
            console.error('Service fault, falling back to local cache:', error);
        }

        // 2. Fallback to Local Cache
        try {
            if (typeof window === 'undefined') return null;
            const cacheRaw = localStorage.getItem(this.STORAGE_KEY);
            if (!cacheRaw) return null;
            const cache = JSON.parse(cacheRaw);
            return (cache && cache[studentId]) || null;
        } catch (e) {
            console.error('Local cache recovery failed:', e);
            return null;
        }
    }
}
