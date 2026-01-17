import { motion } from 'framer-motion'
import { Terminal, PieChart, CheckCircle2, Award, Users, Trash2, ArrowRight } from 'lucide-react'
import type { LogEntry, SummaryStats, CleanedChannel } from '../types'

interface LogsViewProps {
    logs: LogEntry[]
    account: {
        id: string
        username: string
        globalName?: string
        avatar: string
    }
    cleaning: boolean
    summaryStats: SummaryStats
    cleanedChannels: CleanedChannel[]
    logEndRef: React.RefObject<HTMLDivElement>
    onStop: () => void
    onShowSummary: () => void
    onShowChannelList: () => void
    onDone: () => void
}

export default function LogsView({
    logs,
    account,
    cleaning,
    summaryStats,
    cleanedChannels,
    logEndRef,
    onStop,
    onShowSummary,
    onShowChannelList,
    onDone
}: LogsViewProps) {
    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
            <div className="flex-shrink-0 px-6 py-4 border-b border-[#1f1f23] flex items-center justify-between bg-[#0e0e10] z-20">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-500">
                                <Terminal className="w-5 h-5" />
                            </div>
                            Operation Console
                        </h2>
                    </div>
                </div>

                <div className="flex gap-3">
                    {cleaning ? (
                        <button
                            onClick={onStop}
                            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg font-bold text-sm transition-all border border-red-500/20"
                        >
                            Stop Operation
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onShowSummary}
                                className="px-4 py-2 bg-[#1f1f23] hover:bg-[#2b2b30] border border-[#232328] rounded-lg text-sm font-bold text-slate-300 transition-colors flex items-center gap-2"
                            >
                                <PieChart className="w-4 h-4" />
                                View Report
                            </button>
                            <button
                                onClick={onDone}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition-all"
                            >
                                Done
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="space-y-3">
                    {logs.map((log) => {
                        // SYSTEM / SUCCESS / SUMMARY LOGS
                        if (log.type === 'system' || log.type === 'success' || log.type === 'summary') {
                            return (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-center"
                                >
                                    {log.type === 'system' && (
                                        <div className="bg-[#1f1f23] border border-[#2b2b30] rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                            <span className="text-sm font-medium text-slate-300">{log.content}</span>
                                        </div>
                                    )}

                                    {log.type === 'success' && (
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3 flex items-center gap-3 w-full">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-emerald-400">{log.content}</div>
                                                <div className="text-xs text-emerald-500/60 mt-0.5">{log.timestamp.toLocaleTimeString()}</div>
                                            </div>
                                        </div>
                                    )}

                                    {log.type === 'summary' && (
                                        <div className="bg-gradient-to-br from-[#1a1a1e] to-[#0e0e10] border border-[#2b2b30] rounded-2xl w-full overflow-hidden shadow-2xl mt-4">
                                            <div className="p-5 border-b border-[#232328] flex items-center gap-4 bg-[#1a1a1e]">
                                                <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                                    <Award className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-white">Operation Complete</h3>
                                                    <p className="text-xs text-slate-400">Successfully processed deletion usage.</p>
                                                </div>
                                                <button
                                                    onClick={onShowChannelList}
                                                    className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-600/30 hover:border-indigo-600/50 rounded-lg text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-all flex items-center gap-2"
                                                >
                                                    <Users className="w-3.5 h-3.5" />
                                                    View Details
                                                </button>
                                            </div>
                                            <div className="p-5 grid grid-cols-2 gap-4">
                                                <div className="bg-[#1f1f23] rounded-xl p-4 border border-[#2b2b30]">
                                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Messages</div>
                                                    <div className="text-2xl font-black text-white">{summaryStats.total}</div>
                                                </div>
                                                <div className="bg-[#1f1f23] rounded-xl p-4 border border-[#2b2b30]">
                                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Conversations</div>
                                                    <div className="text-2xl font-black text-white">{cleanedChannels.length}</div>
                                                </div>
                                            </div>
                                            
                                            {/* Cleaned Conversations Preview */}
                                            {cleanedChannels.length > 0 && (
                                                <div className="p-5 pt-0">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-white">Cleaned Conversations</h4>
                                                                <p className="text-[10px] text-slate-500">Successfully processed</p>
                                                            </div>
                                                        </div>
                                                        <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                                            <span className="text-xs font-bold text-emerald-400">{cleanedChannels.length} total</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {cleanedChannels.slice(0, 3).map((channel) => (
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
                                                                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-[#0e0e10]">
                                                                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                                                                        </div>
                                                                    </div>

                                                                    {/* User Info */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <h5 className="font-bold text-white text-sm truncate group-hover:text-emerald-400 transition-colors">{channel.name}</h5>
                                                                        <div className="flex items-center gap-2 mt-0.5">
                                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-500/10 rounded-md">
                                                                                <Trash2 className="w-3 h-3 text-rose-400" />
                                                                                <span className="text-xs font-bold text-rose-300">{channel.count}</span>
                                                                                <span className="text-[10px] text-slate-500">deleted</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Progress indicator */}
                                                                    <div className="flex flex-col items-end gap-1">
                                                                        <div className="px-2 py-1 bg-emerald-500/10 rounded-md">
                                                                            <span className="text-[10px] font-bold text-emerald-400 uppercase">Done</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {cleanedChannels.length > 3 && (
                                                        <button
                                                            onClick={onShowChannelList}
                                                            className="w-full mt-3 py-3 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 hover:from-indigo-600/20 hover:to-purple-600/20 border border-indigo-500/30 hover:border-indigo-500/50 rounded-xl text-sm font-bold text-indigo-300 hover:text-indigo-200 transition-all flex items-center justify-center gap-2 group/btn"
                                                        >
                                                            <Users className="w-4 h-4" />
                                                            <span>View All {cleanedChannels.length} Conversations</span>
                                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )
                        }

                        // MESSAGE LOGS
                        return (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl bg-[#16161a] border border-[#232328] hover:border-[#2f3136] transition-all opacity-80 hover:opacity-100"
                            >
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#232328] overflow-hidden flex-shrink-0 mt-1">
                                        {account.avatar && <img src={account.avatar} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <div className="flex flex-col">
                                                <h4 className="font-bold text-white text-sm leading-tight">{account.globalName || account.username}</h4>
                                                <span className="text-[11px] text-slate-500 font-medium">@{account.username}</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-600 whitespace-nowrap ml-2">{log.timestamp.toLocaleTimeString()}</span>
                                        </div>
                                        {log.content && <p className="text-slate-300 text-sm leading-relaxed mb-2">{log.content}</p>}

                                        {/* Attachments (Images/GIFs) */}
                                        {log.attachments.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {log.attachments.map((url, idx) => (
                                                    <div key={idx} className="rounded-lg overflow-hidden border border-[#2b2b30] max-w-xs">
                                                        <img src={url} alt="attachment" className="w-full h-auto" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Embeds (Tenor GIFs, etc.) */}
                                        {log.embeds.length > 0 && (
                                            <div className="flex flex-col gap-2 mt-2">
                                                {log.embeds.map((embed, idx) => (
                                                    <div key={idx} className="rounded-lg overflow-hidden border border-[#2b2b30] bg-[#1a1a1e] max-w-md">
                                                        {embed.thumbnail?.url && (
                                                            <img src={embed.thumbnail.url} alt="embed" className="w-full h-auto" />
                                                        )}
                                                        {embed.image?.url && (
                                                            <img src={embed.image.url} alt="embed" className="w-full h-auto" />
                                                        )}
                                                        {embed.video?.url && (
                                                            <video src={embed.video.url} controls className="w-full h-auto" />
                                                        )}
                                                        {(embed.title || embed.description) && (
                                                            <div className="p-3">
                                                                {embed.title && <div className="text-sm font-bold text-white mb-1">{embed.title}</div>}
                                                                {embed.description && <div className="text-xs text-slate-400">{embed.description}</div>}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                    <div ref={logEndRef} />
                </div>
            </div>
        </div>
    )
}
