import { Trash2, Shield, AlertCircle } from 'lucide-react'
import type { AppSettings } from '../types'

interface SettingsViewProps {
    settings: AppSettings
    account: {
        username: string
    }
    onSettingsChange: (settings: AppSettings) => void
    onSignOut: () => void
}

export default function SettingsView({ settings, account, onSettingsChange, onSignOut }: SettingsViewProps) {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-white mb-2">Settings</h1>
                    <p className="text-slate-400 text-sm">Configure deletion behavior and application preferences</p>
                </div>

                {/* Deletion Settings */}
                <div className="bg-[#16161a] rounded-2xl border border-[#232328] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-rose-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Deletion Settings</h2>
                                <p className="text-xs text-slate-500">Control message deletion behavior</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onSettingsChange({
                                ...settings,
                                deleteDelay: 600,
                                batchSize: 100
                            })}
                            className="px-4 py-2 bg-[#1a1a1e] hover:bg-[#232328] border border-[#232328] hover:border-indigo-500/30 rounded-lg text-xs font-bold text-slate-400 hover:text-indigo-400 transition-all"
                        >
                            Reset to Default
                        </button>
                    </div>

                    <div className="space-y-5">
                        {/* Delete Delay */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <label className="text-sm font-bold text-white">Delete Delay (ms)</label>
                                    <p className="text-xs text-slate-500 mt-0.5">Time between each message deletion</p>
                                </div>
                                <span className="text-lg font-mono font-bold text-indigo-400">{settings.deleteDelay}ms</span>
                            </div>
                            <input
                                type="range"
                                min="300"
                                max="2000"
                                step="100"
                                value={settings.deleteDelay}
                                onChange={(e) => onSettingsChange({ ...settings, deleteDelay: parseInt(e.target.value) })}
                                className="w-full h-2 bg-[#232328] rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                                <span>300ms (Fast)</span>
                                <span>2000ms (Safe)</span>
                            </div>
                        </div>

                        {/* Batch Size */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <label className="text-sm font-bold text-white">Batch Size</label>
                                    <p className="text-xs text-slate-500 mt-0.5">Messages fetched per request</p>
                                </div>
                                <span className="text-lg font-mono font-bold text-indigo-400">{settings.batchSize}</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="100"
                                step="10"
                                value={settings.batchSize}
                                onChange={(e) => onSettingsChange({ ...settings, batchSize: parseInt(e.target.value) })}
                                className="w-full h-2 bg-[#232328] rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                                <span>50</span>
                                <span>100 (Max)</span>
                            </div>
                        </div>

                        {/* Auto Refresh */}
                        <div className="flex items-center justify-between p-4 bg-[#1a1a1e] rounded-xl border border-[#232328]">
                            <div>
                                <label className="text-sm font-bold text-white">Auto Refresh DM List</label>
                                <p className="text-xs text-slate-500 mt-0.5">Automatically refresh every 5 seconds</p>
                            </div>
                            <button
                                onClick={() => onSettingsChange({ ...settings, autoRefresh: !settings.autoRefresh })}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.autoRefresh ? 'bg-indigo-600' : 'bg-[#232328]'}`}
                            >
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.autoRefresh ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Application Info */}
                <div className="bg-[#16161a] rounded-2xl border border-[#232328] p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Application Info</h2>
                            <p className="text-xs text-slate-500">Version and system details</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-[#1a1a1e] rounded-lg">
                            <span className="text-sm text-slate-400">Version</span>
                            <span className="text-sm font-mono font-bold text-white">1.0.0</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#1a1a1e] rounded-lg">
                            <span className="text-sm text-slate-400">Developer</span>
                            <span className="text-sm font-mono font-bold text-white">Copief</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#1a1a1e] rounded-lg">
                            <span className="text-sm text-slate-400">Account</span>
                            <span className="text-sm font-mono font-bold text-white">@{account.username}</span>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-rose-500/5 rounded-2xl border border-rose-500/20 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-5 h-5 text-rose-500" />
                        <h2 className="text-lg font-bold text-rose-500">Danger Zone</h2>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">These actions cannot be undone</p>
                    <button
                        onClick={onSignOut}
                        className="w-full py-3 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-600/30 hover:border-rose-600/50 rounded-xl text-rose-500 font-bold text-sm transition-all"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}
