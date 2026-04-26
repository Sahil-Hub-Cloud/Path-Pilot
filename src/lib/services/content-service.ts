import { supabase } from '../supabase';

export interface ContentItem {
    id?: string;
    institution_id: string;
    cohort_id?: string | null;
    title: string;
    description?: string;
    content_type: 'pdf' | 'video' | 'text' | 'link' | 'syllabus';
    file_url?: string;
    file_size_bytes?: number;
    metadata?: Record<string, any>;
    uploaded_by: string;
    created_at?: string;
}

export class ContentService {
    /**
     * Upload content metadata to the database.
     * File upload to Supabase Storage should be done separately.
     */
    static async createContent(content: Omit<ContentItem, 'id' | 'created_at'>): Promise<ContentItem | null> {
        try {
            const { data, error } = await supabase
                .from('institution_content')
                .insert(content)
                .select()
                .single();

            if (error) throw error;
            return data as ContentItem;
        } catch (e) {
            console.error('ContentService: Create failed:', e);
            return null;
        }
    }

    /**
     * List content for an institution, optionally filtered by cohort.
     */
    static async listContent(institutionId: string, cohortId?: string): Promise<ContentItem[]> {
        try {
            let query = supabase
                .from('institution_content')
                .select('*')
                .eq('institution_id', institutionId)
                .order('created_at', { ascending: false });

            if (cohortId) {
                query = query.eq('cohort_id', cohortId);
            }

            const { data, error } = await query;
            if (error) throw error;
            return (data || []) as ContentItem[];
        } catch (e) {
            console.error('ContentService: List failed:', e);
            return [];
        }
    }

    /**
     * Delete content by ID.
     */
    static async deleteContent(contentId: string): Promise<boolean> {
        try {
            // Get file URL first (to delete from storage)
            const { data: content } = await supabase
                .from('institution_content')
                .select('file_url')
                .eq('id', contentId)
                .single();

            // Delete from storage if file exists
            if (content?.file_url) {
                const path = content.file_url.split('/').pop();
                if (path) {
                    await supabase.storage
                        .from('institution-content')
                        .remove([path]);
                }
            }

            // Delete DB record
            const { error } = await supabase
                .from('institution_content')
                .delete()
                .eq('id', contentId);

            if (error) throw error;
            return true;
        } catch (e) {
            console.error('ContentService: Delete failed:', e);
            return false;
        }
    }

    /**
     * Upload file to Supabase Storage and return the public URL.
     */
    static async uploadFile(
        institutionId: string,
        fileName: string,
        fileBuffer: ArrayBuffer,
        contentType: string
    ): Promise<string | null> {
        try {
            const path = `${institutionId}/${Date.now()}_${fileName}`;
            const { error } = await supabase.storage
                .from('institution-content')
                .upload(path, fileBuffer, { contentType });

            if (error) throw error;

            const { data: urlData } = supabase.storage
                .from('institution-content')
                .getPublicUrl(path);

            return urlData.publicUrl;
        } catch (e) {
            console.error('ContentService: Upload failed:', e);
            return null;
        }
    }
}
