import Link from 'next/link';
import { FaFilePdf, FaShieldAlt } from 'react-icons/fa';

export default function COPPAPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 md:p-12 font-inter">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="border-b border-cyan-500/30 pb-6">
                    <h1 className="text-4xl font-black font-orbitron text-cyan-400 mb-2">COPPA Compliance Protocol</h1>
                    <p className="text-slate-400">Children's Online Privacy Protection Act (15 U.S.C. §§ 6501–6506)</p>
                </div>

                {/* Status Block */}
                <div className="p-6 bg-red-900/10 border border-red-500/30 rounded-xl flex items-start gap-4">
                    <FaShieldAlt className="text-3xl text-red-500 mt-1" />
                    <div>
                        <h3 className="text-xl font-bold text-red-400 mb-2">Restricted Access for Users Under 13</h3>
                        <p className="text-slate-300 leading-relaxed text-sm">
                            Path Pilot utilizes advanced heuristic analysis and data collection techniques that fall under strict COPPA regulations.
                            We do not knowingly collect personal information from children under 13 without verifiable parental consent.
                        </p>
                    </div>
                </div>

                {/* Process */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Parental Consent Logic</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                            <span className="block text-2xl font-bold text-cyan-400 mb-2">01</span>
                            <h4 className="font-bold mb-2">Age Verification</h4>
                            <p className="text-xs text-slate-400">All users must verify age upon neural link initiation via our precise date-picker gate.</p>
                        </div>
                        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                            <span className="block text-2xl font-bold text-cyan-400 mb-2">02</span>
                            <h4 className="font-bold mb-2">Data Isolation</h4>
                            <p className="text-xs text-slate-400">Accounts identified as under-13 are immediately blocked from data ingestion pipelines.</p>
                        </div>
                        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                            <span className="block text-2xl font-bold text-cyan-400 mb-2">03</span>
                            <h4 className="font-bold mb-2">Parental Override</h4>
                            <p className="text-xs text-slate-400">Access can be restored only after signed consent is processed by our legal trust node.</p>
                        </div>
                    </div>
                </div>

                {/* Action Area */}
                <div className="p-8 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Required Action for Under-13 Access</h2>
                    <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                        To authorize a child's account, download the official Consent Form below, sign it, and email it to <span className="text-cyan-400 font-mono">trust@pathpilot.app</span>.
                    </p>

                    <a
                        href="/legal/parent-consent-form.pdf"
                        download
                        className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)]"
                    >
                        <FaFilePdf className="text-xl" />
                        <span>Download Consent Form (PDF)</span>
                    </a>
                </div>

                <div className="text-center text-xs text-slate-500 mt-12">
                    <Link href="/" className="hover:text-cyan-400 underline">Return to Homepage</Link>
                </div>
            </div>
        </div>
    );
}
