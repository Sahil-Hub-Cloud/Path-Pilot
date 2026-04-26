import { motion } from 'framer-motion';

interface IntegrationRowProps {
    id: string;
    name: string;
    icon: string;
    description: string;
    isConnected: boolean;
    onToggle: () => void;
}

export default function IntegrationRow({ id, name, icon, description, isConnected, onToggle }: IntegrationRowProps) {
    return (
        <motion.div
            layout
            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${isConnected ? 'bg-cyan-900/10 border-cyan-500/30' : 'bg-white/5 border-white/5'}`}
        >
            <div className="flex items-center gap-4">
                <div className={`text-2xl ${isConnected ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                    {icon}
                </div>
                <div>
                    <h3 className={`font-bold text-sm ${isConnected ? 'text-cyan-400' : 'text-slate-300'}`}>
                        {name}
                        {isConnected && <span className="ml-2 text-[10px] bg-cyan-900/50 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">LINKED</span>}
                    </h3>
                    <p className="text-xs text-slate-500">{description}</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`} />
                    <span className="text-[10px] uppercase font-mono text-slate-500">{isConnected ? 'LIVE' : 'OFFLINE'}</span>
                </div>
                <button
                    onClick={onToggle}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${isConnected
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20'
                        }`}
                >
                    {isConnected ? 'Disconnect' : 'Connect'}
                </button>
            </div>
        </motion.div>
    );
}
