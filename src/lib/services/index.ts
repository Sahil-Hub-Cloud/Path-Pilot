import { VernacularAI } from './vernacular-ai';
import { ProofOfMastery } from './mastery-proof';

export class ServiceHub {
    public vernacularAI: VernacularAI;
    public proofOfMastery: ProofOfMastery;

    private static instance: ServiceHub;

    private constructor() {
        this.vernacularAI = new VernacularAI();
        this.proofOfMastery = new ProofOfMastery();
    }

    public static getInstance(): ServiceHub {
        if (!ServiceHub.instance) {
            ServiceHub.instance = new ServiceHub();
        }
        return ServiceHub.instance;
    }
}

export const hub = ServiceHub.getInstance();

// Export individual services for direct access
export { VernacularAI } from './vernacular-ai';
export { ProofOfMastery } from './mastery-proof';
