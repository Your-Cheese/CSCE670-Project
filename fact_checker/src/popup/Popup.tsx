import React from 'react';
import { Settings, Power, ExternalLink } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const Popup: React.FC = () => {
    const { settings, updateSettings, loading } = useSettings();

    if (loading) {
        return <div className="p-4 w-64 flex justify-center">Loading...</div>;
    }

    const toggleEnabled = () => {
        updateSettings({ enabled: !settings.enabled });
    };

    const openSettings = () => {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('src/options/index.html'));
        }
    };

    return (
        <div className="w-80 bg-slate-900 text-slate-50 p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    Ghost Fact-Checker
                </h1>
                <div className={`w-3 h-3 rounded-full ${settings.enabled ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
            </div>

            <div className="space-y-4">
                <button
                    onClick={toggleEnabled}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${settings.enabled
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                        : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'
                        }`}
                >
                    <Power size={18} />
                    {settings.enabled ? 'Disable Extension' : 'Enable Extension'}
                </button>

                <button
                    onClick={openSettings}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all duration-200"
                >
                    <Settings size={18} />
                    Open Settings
                </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
                <a href="https://github.com/quocduyvu6262/CSCE670-Project" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 flex items-center justify-center gap-1">
                    View on GitHub <ExternalLink size={10} />
                </a>
            </div>
        </div>
    );
};

export default Popup;
