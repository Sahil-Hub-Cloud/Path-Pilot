export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-slate-300 font-mono p-8 selection:bg-[var(--accent-teal)] selection:text-black dark:text-white">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="border-b border-white/10 pb-8 mb-12">
                    <h1 className="text-4xl font-black text-white mb-2 font-orbitron tracking-widest">TERMS OF OPERATION</h1>
                    <p className="text-[var(--text-dim)] uppercase tracking-widest text-xs">Path Pilot // End User License Agreement v1.0</p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">1. Acceptance of Protocol</h2>
                    <p>By initializing the Path Pilot System (accessing this web application), you agree to these Terms of Operation. If you do not accept these parameters, please abort the session immediately.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. Usage License</h2>
                    <p>Path Pilot grants you a limited, non-exclusive, non-transferable license to access the neural training modules for personal educational optimization. You may not:</p>
                    <ul className="list-disc pl-5 space-y-2 marker:text-red-500">
                        <li>Reverse engineer the "Gemini Engine" logic or "Cybernetic Profile" algorithms.</li>
                        <li>Automate sessions using unauthorized bots (except within the 'Bot Farm' module).</li>
                        <li>Redistribute premium content or proprietary 'Ghost Protocol' methodologies.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. Premium Uplinks (Payments)</h2>
                    <p>Upgrading to "Premium Pilot" status provides enhanced access. Payments are processed securely via Stripe. Refunds are issued only for "Critical System Failure" (app downtime &gt; 24h) if reported within 3 days.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">4. Liability Disclaimer</h2>
                    <p>Path Pilot is a simulation. Career outcomes ("Placement") are probabilistic projections, not guarantees. Converting energy points to real-world interviews requires external user action.</p>
                </section>

                <footer className="pt-12 mt-12 border-t border-white/10 text-xs text-slate-600">
                    <p>CONTACT COMMAND: legal@PathPilot.ai</p>
                    <p>LAST UPDATE: {new Date().toLocaleDateString()}</p>
                </footer>
            </div>
        </div>
    );
}
