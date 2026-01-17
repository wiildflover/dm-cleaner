import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, FileText, ImageIcon, MessageSquare, ArrowRight, Trash2 } from 'lucide-react'
import type { SummaryStats, CleanedChannel } from '../../types'

interface SummaryModalProps {
    show: boolean
    cleaning: boolean
    stats: SummaryStats
    cleanedChannels: CleanedChannel[]
    onClose: () => void
    onShowChannelList: () => void
}

export default function SummaryModal({ show, cleaning, stats, cleanedChannels, onClose, onShowChannelList }: SummaryModalProps) {
    return (
        <AnimatePresence mode="wait">
            {show && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-sm" onClick={onClose}>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#16161a] w-full max-w-2xl rounded-2xl border border-[#232328] overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[#232328] bg-[#0e0e10]">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${cleaning ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                    {cleaning ? <Loader2 className="w-8 h-8 animate-spin" /> : <CheckCircle2 className="w-8 h-8" />}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-1">{cleaning ? 'Operation Paused' : 'Operation Complete'}</h2>
                                    <p className="text-sm text-slate-400">
                                        {cleaning ? 'The cleaning process has been paused.' : 'Your messages have been successfully deleted.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Overview */}
                        <div className="p-6 bg-[#0e0e10] border-b border-[#232328]">
                            <div className="grid grid-cols-4 gap-4">
                                <button
                                    onClick={onShowChannelList}
                                    className="bg-[#1a1a1e] rounded-xl p-4 border border-[#232328] hover:border-indigo-500/40 transition-all group cursor-pointer"
                                >
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-hover:text-indigo-400 transition-colors">Total</div>
                                    <div className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors mb-2">{stats.total || 0}</div>
                                    <div className="text-[10px] font-bold text-slate-600 group-hover:text-indigo-500 transition-colors flex items-center justify-center gap-1">
                                        <span>View details</span>
                                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </button>
                                <div className="bg-[#1a1a1e] rounded-xl p-4 border border-[#232328]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Text</div>
                                    </div>
                                    <div className="text-3xl font-black text-white">{stats.text || 0}</div>
                                </div>
                                <div className="bg-[#1a1a1e] rounded-xl p-4 border border-[#232328]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Images</div>
                                    </div>
                                    <div className="text-3xl font-black text-white">{stats.images || 0}</div>
                                </div>
                                <div className="bg-[#1a1a1e] rounded-xl p-4 border border-[#232328]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Links</div>
                                    </div>
                                    <div className="text-3xl font-black text-white">{stats.embeds || 0}</div>
                                </div>
                            </div>
                        </div>

                        {/* Cleaned Conversations List */}
                        {cleanedChannels.length > 0 && (
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">Cleaned Conversations</h3>
                                                <p className="text-xs text-slate-500">Successfully processed</p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                            <span className="text-xs font-bold text-emerald-400">{cleanedChannels.length} total</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {cleanedChannels.map((channel) => (
                                            <div
                                                key={channel.id}
                                                className="relative group"
                                            >
                                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#0e0e10] to-[#1a1a1e] rounded-xl border border-[#232328] hover:border-emerald-500/30 transition-colors">
                                                    {/* Avatar with status */}
                                                    <div className="relative">
                                                        <div className="w-10 h-10 rounded-full bg-[#232328] overflow-hidden ring-2 ring-[#232328] group-hover:ring-emerald-500/30 transition-all">
                                                            {channel.avatar ? (
                                                                <img src={channel.avatar} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                                                    {channel.name[0]?.toUpperCase() || '?'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-[#16161a]">
                                                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                                                        </div>
                                                    </div>

                                                    {/* User Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-white text-sm truncate group-hover:text-emerald-400 transition-colors">{channel.name}</h4>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-500/10 rounded-md">
                                                                <Trash2 className="w-3 h-3 text-rose-400" />
                                                                <span className="text-xs font-bold text-rose-300">{channel.count}</span>
                                                                <span className="text-[10px] text-slate-500">deleted</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Status badge */}
                                                    <div className="px-2 py-1 bg-emerald-500/10 rounded-md">
                                                        <span className="text-[10px] font-bold text-emerald-400 uppercase">Done</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="p-6 border-t border-[#232328] bg-[#0e0e10]">
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-indigo-900/20"
                            >
                                Close Report
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
