/**
 * @file Sidebar.tsx
 * @author Wildflover
 * @description Navigation sidebar component with blue gradient theme
 * @language TypeScript/React
 */

import { Users, MessageSquare, MoreVertical, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Stats } from '../types'

interface SidebarProps {
    account: {
        username: string
        globalName?: string
        avatar: string
    }
    stats: Stats
    activeTab: 'messages' | 'settings'
    onTabChange: (tab: 'messages' | 'settings') => void
    onShowFriends: () => void
    onBack: () => void
}

export default function Sidebar({ account, stats, activeTab, onTabChange, onShowFriends, onBack }: SidebarProps) {
    return (
        <aside className="w-72 bg-[#0d1117]/80 backdrop-blur-xl flex flex-col border-r border-wf-blue-500/10 relative z-20 transition-all">
            {/* Profile Section */}
            <div className="p-6 pb-2">
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3 group">
                        <div className="w-20 h-20 rounded-full p-1 border-2 border-wf-blue-500/30 group-hover:border-wf-blue-400 transition-colors duration-300">
                            <div className="w-full h-full rounded-full overflow-hidden bg-[#1f1f23]">
                                {account.avatar ? (
                                    <img src={account.avatar} alt="Me" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br from-wf-blue-500 to-wf-violet-500">
                                        {account.username[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#0d1117] rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0d1117]" />
                        </div>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-0.5">{account.globalName || account.username}</h2>
                    <p className="text-xs font-medium text-slate-500">@{account.username}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="px-4 py-3">
                <div className="grid grid-cols-2 gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onShowFriends}
                        className="bg-[#161b22]/80 p-3 rounded-xl border border-wf-blue-500/10 hover:border-wf-blue-500/30 hover:bg-[#1c2128] transition-all duration-300 text-center group cursor-pointer"
                    >
                        <div className="text-wf-blue-400 mb-1 flex justify-center">
                            <Users className="w-5 h-5 group-hover:text-wf-blue-300 transition-colors" />
                        </div>
                        <div className="text-xl font-bold text-white mb-0.5">{stats.friendCount}</div>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide group-hover:text-wf-blue-300 transition-colors">Friends</div>
                    </motion.button>
                    <div className="bg-[#161b22]/80 p-3 rounded-xl border border-wf-blue-500/10 hover:border-wf-blue-500/30 transition-all duration-300 text-center group cursor-default">
                        <div className="text-wf-blue-400 mb-1 flex justify-center">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="text-xl font-bold text-white mb-0.5">{stats.dmCount}</div>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">DMs</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-3 space-y-2 overflow-y-auto custom-scrollbar">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-2">Menu</div>

                <button
                    onClick={() => onTabChange('messages')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${activeTab === 'messages'
                        ? 'bg-gradient-to-r from-wf-blue-600 to-wf-indigo-600 text-white shadow-lg shadow-wf-blue-900/30'
                        : 'text-slate-400 hover:bg-[#161b22] hover:text-white'
                        }`}
                >
                    {activeTab === 'messages' && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                    )}
                    <MessageSquare className={`w-5 h-5 ${activeTab === 'messages' ? 'text-white' : 'group-hover:text-wf-blue-400 transition-colors'}`} />
                    <span className="font-semibold text-sm">Messages</span>
                    {activeTab === 'messages' && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                    )}
                </button>

                <button
                    onClick={() => onTabChange('settings')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${activeTab === 'settings'
                        ? 'bg-gradient-to-r from-wf-blue-600 to-wf-indigo-600 text-white shadow-lg shadow-wf-blue-900/30'
                        : 'text-slate-400 hover:bg-[#161b22] hover:text-white'
                        }`}
                >
                    {activeTab === 'settings' && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                    )}
                    <MoreVertical className={`w-5 h-5 ${activeTab === 'settings' ? 'text-white' : 'group-hover:text-wf-blue-400 transition-colors'}`} />
                    <span className="font-semibold text-sm">Settings</span>
                </button>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-wf-blue-500/10">
                <button
                    onClick={onBack}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#161b22] hover:bg-red-600/20 border border-wf-blue-500/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all font-medium text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    )
}
