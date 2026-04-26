
/* eslint-disable @typescript-eslint/no-explicit-any */
// --- Vector Math Helpers ---
// Client-side only wraps API calls
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface VectorDocument {
    id?: string;
    userId: string;
    text: string;
    embedding: number[];
    metadata: any;
    timestamp: any;
}

export class VectorBrain {
    /**
     * Upserts a vectorized syllabus into the user's personal index via API.
     */
    static async indexSyllabus(userId: string, text: string, moduleId: number): Promise<void> {
        try {
            await fetch('/api/vector', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'index', userId, text, moduleId })
            });
        } catch (error) {
            console.error("Vector Indexing Failed:", error);
        }
    }

    /**
     * Performs a semantic search across the user's vectorized knowledge via API.
     */
    static async semanticSearch(userId: string, queryText: string): Promise<any[]> {
        try {
            const response = await fetch('/api/vector', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'search', userId, queryText })
            });
            let data;
            try {
                data = await response.json();
            } catch (e) {
                console.error("Malformed JSON from vector search:", e);
                return [];
            }
            return data?.results || [];
        } catch (error) {
            console.error("Vector Search Failed:", error);
            return [];
        }
    }
}
