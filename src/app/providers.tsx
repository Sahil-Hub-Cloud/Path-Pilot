'use client';

// PostHog and other trackers disabled to prevent interference with Firebase Auth network requests
export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
