import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShieldCheck, Sparkles } from 'lucide-react';
import { InvestigationView } from './components/InvestigationView';
import { VerdictView } from './components/VerdictView';
import { SourceUpdate, Message } from '../types/messages';

export const GhostPopover: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [stage, setStage] = useState<'idle' | 'investigating' | 'synthesis'>('idle');
    const [sources, setSources] = useState<SourceUpdate[]>([]);
    const [verdictStream, setVerdictStream] = useState('');
    const [isStreamComplete, setIsStreamComplete] = useState(false);

    useEffect(() => {
        const handleMessage = (message: Message) => {
            if (message.type === 'TRIGGER_CHECK') {
                setIsVisible(true);
                setStage('investigating');
                setSources([]);
                setVerdictStream('');
                setIsStreamComplete(false);
            } else if (message.type === 'SOURCE_UPDATE') {
                setSources((prev) => {
                    const exists = prev.find((s) => s.url === message.payload.url);
                    if (exists) {
                        return prev.map((s) => (s.url === message.payload.url ? message.payload : s));
                    }
                    return [...prev, message.payload];
                });
            } else if (message.type === 'STREAM_START') {
                setStage('synthesis');
            } else if (message.type === 'STREAM_CHUNK') {
                setVerdictStream((prev) => prev + message.chunk);
            } else if (message.type === 'STREAM_END') {
                setIsStreamComplete(true);
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);
        return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed top-6 right-6 z-[9999] font-sans antialiased text-slate-50">
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-[420px] bg-slate-950/90 backdrop-blur-2xl border border-slate-800/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-white/10"
                >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/30">
                        <h1 className="text-sm font-semibold text-slate-200 flex items-center gap-2.5">
                            {stage === 'investigating' && (
                                <>
                                    <div className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                    </div>
                                    <span className="tracking-wide">Investigating Truth...</span>
                                </>
                            )}
                            {stage === 'synthesis' && (
                                <>
                                    <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <span className="tracking-wide text-emerald-100">Verdict Ready</span>
                                </>
                            )}
                            {stage === 'idle' && (
                                <>
                                    <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <span className="tracking-wide">Ghost Fact-Checker</span>
                                </>
                            )}
                        </h1>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                            title="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            {stage === 'investigating' && (
                                <InvestigationView key="investigation" sources={sources} />
                            )}
                            {stage === 'synthesis' && (
                                <VerdictView
                                    key="verdict"
                                    stream={verdictStream}
                                    sources={sources}
                                    isComplete={isStreamComplete}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
