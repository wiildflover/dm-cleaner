import { motion, AnimatePresence } from 'framer-motion'
import { Users, X, CheckCircle2, Trash2, FileText, ImageIcon, MessageSquare } from 'lucide-react'
import type { CleanedChannel, SummaryStats } from '../../types'

interface ChannelListModalProps {
    show: boolean
    channels: CleanedChannel[]
    stats: SummaryStats
    onClose: () => void
}

export default function ChannelListModal({ show, channels, stats, onClose }: ChannelListModalProps) {
    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 bg-black/90 z-[90] flex items-center justify-center p-6 backdrop-blur-sm" onClick={onClose}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#16161a] w-full max-w-2xl rounded-2xl border border-[#232328] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-[#232328] flex items-center justify-between bg-gradient-to-br from-[#1a1a1e] to-[#0e0e10]">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-indigo-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Cleaned Conversations</h2>
                                    <p className="text-xs font-medium text-slate-500">
                                        {channels.length} conversation{channels.length !== 1 ? 's' : ''} • {stats.total} messages deleted
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-lg hover:bg-[#232328] flex items-center justify-center text-slate-500 hover:text-white transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                            {channels.length > 0 ? (
                                <div className="space-y-2">
                                    {channels.map((channel, index) => (
                                        <motion.div
                                            key={channel.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center gap-4 p-4 bg-[#1a1a1e] rounded-xl border border-[#232328] hover:border-indigo-500/30 hover:bg-[#1f1f23] transition-all group"
                                        >
                                            {/* Avatar */}
                                            <div className="relative flex-shrink-0">
                                                <div className="w-14 h-14 rounded-full bg-[#232328] overflow-hidden ring-2 ring-[#232328] group-hover:ring-indigo-500/30 transition-all">
                                                    {channel.avatar ? (
                                                        <img src={channel.avatar} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xl">
                                                            {channel.name[0]?.toUpperCase() || '?'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-[#16161a]">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-white text-base truncate group-hover:text-indigo-400 transition-colors mb-1">
                                                    {channel.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span className="font-medium">@{channel.name.toLowerCase().replace(/\s+/g, '')}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                    <span className="font-mono">ID: {channel.id.slice(0, 8)}...</span>
                                                </div>
                                            </div>

                                            {/* Stats Badge */}
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-2 bg-[#0e0e10] px-4 py-2 rounded-lg border border-[#232328] group-hover:border-rose-500/30 transition-all">
                                                    <Trash2 className="w-4 h-4 text-rose-400" />
                                                    <span className="text-lg font-black text-white font-mono">{channel.count}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Messages</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                                    <Users className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-lg font-medium">No conversations cleaned yet</p>
                                    <p className="text-sm opacity-60 mt-1">Start cleaning to see results here</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-[#232328] bg-[#0e0e10]">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-xs text-slate-500">
                                    <span className="font-bold text-white">{stats.total}</span> total messages deleted
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <FileText className="w-3 h-3 text-blue-400" />
                                        <span className="font-bold text-white">{stats.text}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <ImageIcon className="w-3 h-3 text-purple-400" />
                                        <span className="font-bold text-white">{stats.images}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MessageSquare className="w-3 h-3 text-emerald-400" />
                                        <span className="font-bold text-white">{stats.embeds}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
