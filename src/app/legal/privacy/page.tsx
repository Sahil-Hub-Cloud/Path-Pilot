export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-slate-300 font-mono p-8 selection:bg-[var(--accent-teal)] selection:text-black dark:text-white">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="border-b border-white/10 pb-8 mb-12">
                    <h1 className="text-4xl font-black text-white mb-2 font-orbitron tracking-widest">PRIVACY PROTOCOL</h1>
                    <p className="text-[var(--text-dim)] uppercase tracking-widest text-xs">Path Pilot // Regulation Firmware v1.0</p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">1. Data Ingestion</h2>
                    <p>Path Pilot collects the following telemetry to optimize your neural evolution:</p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-[var(--accent-teal)]">
                        <li><strong className="text-white">Identity Signals:</strong> Email frequency, display callsign, and authentication tokens (via Firebase).</li>
                        <li><strong className="text-white">Performance Metrics:</strong> Assessment scores, interaction timing, and cognitive energy usage.</li>
                        <li><strong className="text-white">Payment Data:</strong> Transaction metadata is processed by Stripe. We do not store credit card persistence layers.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. Neural Link Integrations</h2>
                    <p>When you sync extensive databases (Notion, PDF), the "Gemini Engine" processes this data ephemerally to generate knowledge graphs. Your raw documents are not permanently stored in our core learning model without explicit override commands.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. COPPA / Children's Compliance</h2>
                    <p>Path Pilot is an advanced training environment. Users under 13 must have a Parental Authorization Key (Verified Email Consent) to access online connectivity features. We do not knowingly collect data from unverified cadets under 13.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">4. Data Termination</h2>
                    <p>You may initiate a "Factory Reset" (Account Deletion) at any time from your Profile terminal. All associated neural weights and personal identifiers will be purged from the mainframe.</p>
                </section>

                <footer className="pt-12 mt-12 border-t border-white/10 text-xs text-slate-600">
                    <p>CONTACT COMMAND: legal@PathPilot.ai</p>
                    <p>LAST UPDATE: {new Date().toLocaleDateString()}</p>
                </footer>
            </div>
        </div>
    );
}
