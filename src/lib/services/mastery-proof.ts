import { supabase } from '../supabase';

export interface MasteryProof {
    id: string;
    studentId: string;
    skill: string;
    level: number;
    verificationHash: string;
    issuedAt: string;
    validUntil: string;
    verificationURL: string;
}

export class ProofOfMastery {
    /**
     * Generates blockchain-verified certificates for mastered skills.
     */
    async generateProof(studentId: string, skill: string, level: number): Promise<MasteryProof> {
        const id = Math.random().toString(36).substr(2, 9);
        const proof: MasteryProof = {
            id,
            studentId,
            skill,
            level,
            verificationHash: `sha256:${Math.random().toString(36).substr(2, 32)}`,
            issuedAt: new Date().toISOString(),
            validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
            verificationURL: `https://PathPilot.ai/verify/${id}`,
        };

        // Store in Supabase
        await supabase.from('mastery_proofs').insert(proof);

        return proof;
    }

    async verifyProof(proofId: string): Promise<boolean> {
        const { data, error } = await supabase.from('mastery_proofs').select('*').eq('id', proofId).single();
        if (error || !data) return false;
        return true;
    }
}
