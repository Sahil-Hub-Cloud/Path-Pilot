import Link from 'next/link';
import { FaUniversity, FaLock } from 'react-icons/fa';

export default function FERPAPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 md:p-12 font-inter">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="border-b border-indigo-500/30 pb-6">
                    <h1 className="text-4xl font-black font-orbitron text-indigo-400 mb-2">FERPA Data-Processing Agreement</h1>
                    <p className="text-slate-400">Family Educational Rights and Privacy Act (20 U.S.C. § 1232g)</p>
                </div>

                {/* Introduction */}
                <div className="prose prose-invert max-w-none text-slate-300">
                    <p className="text-lg leading-relaxed">
                        Path Pilot acknowledges its role as a "School Official" with legitimate educational interests when used by educational institutions.
                        We execute this Data Processing Agreement (DPA) to guarantee strict compliance with FERPA regulations regarding student education records.
                    </p>
                </div>

                {/* Core Commitments */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-indigo-900/10 border border-indigo-500/20 rounded-xl">
                        <FaLock className="text-2xl text-indigo-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Data Sovereignty</h3>
                        <p className="text-slate-400 text-sm">
                            All student data, including neural ingestion graphs and behavioral analytics, is processed and stored exclusively within the United States (AWS US-East-1).
                        </p>
                    </div>
                    <div className="p-6 bg-indigo-900/10 border border-indigo-500/20 rounded-xl">
                        <FaUniversity className="text-2xl text-indigo-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Institutional Control</h3>
                        <p className="text-slate-400 text-sm">
                            Schools retain full ownership of all student records. Path Pilot acts solely as a data processor and will return or destroy data upon contract termination.
                        </p>
                    </div>
                </div>

                {/* Detailed Terms */}
                <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 space-y-6">
                    <h3 className="text-xl font-bold text-white">Standard Contractual Clauses</h3>
                    <ul className="space-y-4 text-sm text-slate-300 list-disc pl-4">
                        <li>
                            <strong>Purpose Limitation:</strong> Student data is used solely for the purpose of providing the Path Pilot adaptive learning service and not for any third-party advertising or profiling.
                        </li>
                        <li>
                            <strong>Security Protocol:</strong> All data in transit and at rest is encrypted using AES-256 standards. Access is restricted to authorized personnel with cleared background checks.
                        </li>
                        <li>
                            <strong>Right to Inspect:</strong> Parents and eligible students have the right to inspect and review their education records stored within the Path Pilot infrastructure.
                        </li>
                        <li>
                            <strong>Data Retention:</strong> Student data is automatically purged 30 days after account deactivation or upon written request from the educational institution.
                        </li>
                    </ul>
                </div>

                {/* Signature Block */}
                <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-white/5 rounded-xl border border-white/10 gap-4">
                    <div>
                        <h4 className="font-bold text-white">Download Signed DPA</h4>
                        <p className="text-xs text-slate-400">Version 2.4 | Updated Jan 2026</p>
                    </div>
                    <a
                        href="/legal/signed-dpa.pdf"
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors text-sm"
                    >
                        Download PDF
                    </a>
                </div>

                <div className="text-center text-xs text-slate-500 mt-12">
                    <Link href="/" className="hover:text-indigo-400 underline">Return to Homepage</Link>
                </div>
            </div>
        </div>
    );
}
