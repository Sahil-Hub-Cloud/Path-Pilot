import { supabase } from '../supabase';
import { MODULES } from '../mock-data';

export interface Module {
    id: number;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    type: string;
    estimated_hours: number;
    risk_level: string;
    energy_cost: number;
}

export class ModuleService {
    static async getAllModules(): Promise<Module[]> {
        try {
            const { data, error } = await supabase
                .from('modules')
                .select('*')
                .order('id', { ascending: true });

            if (error || !data || data.length === 0) {
                console.warn('DB Fetch failed or empty, falling back to local registry:', error?.message);
                return (MODULES || []).map(m => ({
                    id: m.id,
                    title: m.name || 'Untitled Module',
                    description: m.description || 'No briefing available.',
                    difficulty: (m.id === 6 ? 'Expert' : 'Easy'),
                    type: m.type || 'INFRASTRUCTURE',
                    estimated_hours: m.estimatedHours || 1,
                    risk_level: m.riskLevel || 'LOW',
                    energy_cost: m.energyCost || 20
                }));
            }

            return data;
        } catch (e) {
            console.error('Service Fault:', e);
            return [];
        }
    }

    static async getModuleById(id: number): Promise<Module | null> {
        try {
            const { data, error } = await supabase
                .from('modules')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                console.warn(`Module ${id} not found in DB, checking local registry...`);
                const local = MODULES.find(m => m.id === id);
                if (!local) return null;

                return {
                    id: local.id,
                    title: local.name || 'Mission Briefing',
                    description: local.description || 'Intel missing.',
                    difficulty: (local.id === 6 ? 'Expert' : 'Easy'),
                    type: local.type || 'SIMULATION',
                    estimated_hours: local.estimatedHours || 0,
                    risk_level: local.riskLevel || 'LOW',
                    energy_cost: local.energyCost || 20
                };
            }

            return data;
        } catch (e) {
            return null;
        }
    }

    static async getUnitsByModuleId(moduleId: number) {
        try {
            const { data, error } = await supabase
                .from('units')
                .select('*')
                .eq('module_id', moduleId)
                .order('order_index', { ascending: true });

            if (error || !data || data.length === 0) {
                console.warn(`Units for ${moduleId} not found in DB, using local registry...`);
                const local = MODULES.find(m => m.id === moduleId);
                if (!local) return [];

                return local.units.map((u, i) => ({
                    id: u.id,
                    module_id: moduleId,
                    title: u.name,
                    estimated_time: u.estimatedTime,
                    order_index: i + 1
                }));
            }

            return data;
        } catch (e) {
            return [];
        }
    }
}
