import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Shield, Cpu, Key, Eye } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const Options: React.FC = () => {
    const { settings, updateSettings, loading } = useSettings();
    const [localSettings, setLocalSettings] = useState(settings);
    const [isDirty, setIsDirty] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    useEffect(() => {
        if (!loading) {
            setLocalSettings(settings);
        }
    }, [loading, settings]);

    const handleChange = (key: keyof typeof settings, value: any) => {
        setLocalSettings((prev) => {
            const next = { ...prev, [key]: value };
            setIsDirty(JSON.stringify(next) !== JSON.stringify(settings));
            return next;
        });
        setSaveStatus('idle');
    };

    const handleSave = () => {
        setSaveStatus('saving');
        updateSettings(localSettings);
        setTimeout(() => {
            setSaveStatus('saved');
            setIsDirty(false);
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 500);
    };

    const handleReset = () => {
        setLocalSettings(settings);
        setIsDirty(false);
        setSaveStatus('idle');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading settings...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Ghost Fact-Checker Settings
                        </h1>
                        <p className="mt-2 text-slate-400">Configure your AI fact-checking experience.</p>
                    </div>
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 shadow-lg">
                        <Shield className="text-indigo-400" size={24} />
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Appearance Section */}
                    <section className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <Eye size={20} className="text-cyan-400" />
                            Appearance
                        </h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <label htmlFor="showCheckPill" className="block text-sm font-medium text-slate-300">
                                    Show Check Pill
                                </label>
                                <p className="text-xs text-slate-500 mt-1">
                                    Display the floating "Check" pill when text is selected.
                                </p>
                            </div>
                            <button
                                id="showCheckPill"
                                onClick={() => handleChange('showCheckPill', !localSettings.showCheckPill)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${localSettings.showCheckPill ? 'bg-indigo-600' : 'bg-slate-700'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${localSettings.showCheckPill ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </section>

                    {/* AI Configuration Section */}
                    <section className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
                            <Cpu size={20} className="text-indigo-400" />
                            AI Configuration
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    LLM Provider
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleChange('llmProvider', 'google')}
                                        className={`flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-all ${localSettings.llmProvider === 'google'
                                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500'
                                            : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-750'
                                            }`}
                                    >
                                        Google Gemini API
                                    </button>
                                    <button
                                        onClick={() => handleChange('llmProvider', 'local')}
                                        className={`flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-all ${localSettings.llmProvider === 'local'
                                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500'
                                            : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-750'
                                            }`}
                                    >
                                        Local WebLLM (Privacy Focused)
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="llmModel" className="block text-sm font-medium text-slate-300 mb-1">
                                    Model Name
                                </label>
                                <input
                                    type="text"
                                    id="llmModel"
                                    value={localSettings.llmModel}
                                    onChange={(e) => handleChange('llmModel', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                                    placeholder="e.g., gemini-2.5-flash"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Specify the model identifier to use.
                                </p>
                            </div>

                            {localSettings.llmProvider === 'google' && (
                                <div>
                                    <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300 mb-1">
                                        API Key
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key size={16} className="text-slate-500" />
                                        </div>
                                        <input
                                            type="password"
                                            id="apiKey"
                                            value={localSettings.apiKey}
                                            onChange={(e) => handleChange('apiKey', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                                            placeholder="Enter your API key"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Your key is stored locally in your browser.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Action Bar */}
                <div className="mt-8 flex items-center justify-end gap-4 pt-6 border-t border-slate-800">
                    <button
                        onClick={handleReset}
                        disabled={!isDirty}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDirty
                            ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                            : 'text-slate-600 cursor-not-allowed'
                            }`}
                    >
                        <RotateCcw size={16} />
                        Reset Changes
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isDirty && saveStatus !== 'saved'}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-lg ${saveStatus === 'saved'
                            ? 'bg-green-500 text-white shadow-green-500/25'
                            : isDirty
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        <Save size={16} />
                        {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Options;
