import { VernacularAI } from './vernacular-ai';
import { ProofOfMastery } from './mastery-proof';
import { LabStateService } from './lab-state';
import { ModuleService } from './modules';
import { ContentService } from './content-service';
import { CohortService } from './cohort-service';
import { AnalyticsEngine } from './analytics-engine';
import { CopilotService } from './copilot-service';

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
export { LabStateService } from './lab-state';
export { ModuleService } from './modules';

// B2B Services
export { ContentService } from './content-service';
export { CohortService } from './cohort-service';
export { AnalyticsEngine } from './analytics-engine';
export { CopilotService } from './copilot-service';
