import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || 'test_token';

export const Analytics = {
    init: () => {
        try {
            // Prevent multiple initializations
            if ((mixpanel as any).__loaded) return;

            mixpanel.init(MIXPANEL_TOKEN, {
                debug: false, // Disable debug calls to prevent mutex timeout logs
                track_pageview: true,
                persistence: 'localStorage',
                ignore_dnt: true
            });
        } catch (e) {
            console.warn("Mixpanel init failed:", e);
        }
    },

    identify: (id: string, email?: string) => {
        try {
            mixpanel.identify(id);
            if (email) mixpanel.people.set({ $email: email });
        } catch (e) { console.error(e); }
    },

    track: (event: string, props?: any) => {
        try {
            mixpanel.track(event, props);
        } catch (e) { console.error(e); }
    },

    trackPaywallClick: (source: string) => {
        try {
            mixpanel.track('paywall_click', {
                source,
                timestamp: new Date().toISOString(),
                product: 'Ghost Protocol'
            });
        } catch (e) { console.error(e); }
    }
};
