export const FEATURE_FLAGS = {
    USE_NEW_UI: true,
    ENABLE_AI_REASONING_V2: false,
    SHOW_BETA_FEATURES: true,
};

export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
    if (typeof window !== 'undefined') {
        const override = localStorage.getItem(`FF_${flag}`);
        if (override === 'true') return true;
        if (override === 'false') return false;
    }
    return FEATURE_FLAGS[flag];
}
