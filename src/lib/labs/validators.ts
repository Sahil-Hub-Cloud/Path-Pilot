export interface ValidationResult {
    success: boolean;
    message: string;
}

export const LAB_VALIDATORS: Record<string, (code: string, output: string) => ValidationResult> = {
    '1': (code, output) => {
        // Mission: Implement search logic
        const hasFunction = code.includes('function search');
        const hasOutput = output.includes('Searching for: cyber security') || output.includes('cyber security');
        if (hasFunction && hasOutput) {
            return { success: true, message: 'Neural Interface Synchronized. Search protocol verified.' };
        }
        return { success: false, message: 'Interface error. Ensure the search function outputs the query context.' };
    },
    '2': (code, output) => {
        // Mission: Implement threat detection
        const hasFunction = code.includes('def detect_threat');
        const hasOutput = output.includes('Scanning 2 logs');
        if (hasFunction && hasOutput) {
            return { success: true, message: 'Forensic Logic Integrity Verified. Threat detected.' };
        }
        return { success: false, message: 'Detection failure. Logic must handle exactly 2 log entries.' };
    }
};

export function validateLab(labId: string, code: string, output: string): ValidationResult {
    const validator = LAB_VALIDATORS[labId];
    if (validator) {
        return validator(code, output);
    }
    return { success: true, message: 'Generic Mission Complete. Patterns recognized.' };
}
