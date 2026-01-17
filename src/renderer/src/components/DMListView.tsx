import { motion } from 'framer-motion'
import { Search, CheckCircle2, ArrowRight, MessageSquare } from 'lucide-react'
import type { DMChannel } from '../types'
import { getBadges } from '../utils/badges'

interface DMListViewProps {
    dms: DMChannel[]
    selectedDMs: Set<string>
    onToggleSelection: (id: string) => void
    onOpenChat: (dm: DMChannel) => void
}

export default function DMListView({ dms, selectedDMs, onToggleSelection, onOpenChat }: DMListViewProps) {
    if (dms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Search className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-lg font-medium">No conversations found.</p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-2.5">
            {dms.map((dm, index) => {
                const recipient = dm.recipients[0]
                const isSelected = selectedDMs.has(dm.id)

                return (
                    <motion.div
                        key={dm.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.005 }}
                        onClick={() => onToggleSelection(dm.id)}
                        className={`relative group p-3 rounded-xl border cursor-pointer transition-all duration-200 flex items-center gap-4 ${isSelected
                            ? 'bg-indigo-600/5 border-indigo-600 shadow-md shadow-indigo-900/10'
                            : 'bg-[#16161a] border-transparent hover:border-[#2b2b30] hover:bg-[#1a1a1e] hover:-translate-y-0.5 hover:shadow-lg'
                            }`}
                    >
                        {/* Selection Checkbox */}
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-300 ${isSelected
                            ? 'bg-indigo-600 border-indigo-600 scale-105'
                            : 'border-[#2b2b30] bg-[#131316] text-transparent group-hover:border-slate-500'
                            }`}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </div>

                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-[#232328] overflow-hidden shadow-inner flex-shrink-0">
                                {recipient?.avatar ? (
                                    <img
                                        src={`https://cdn.discordapp.com/avatars/${recipient.id}/${recipient.avatar}.png`}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-lg">
                                        {recipient?.username?.[0] || '?'}
                                    </div>
                                )}
                            </div>
                            {dm.type === 3 && (
                                <div className="absolute -bottom-1.5 -right-1.5 bg-[#16161a] px-1.5 py-0.5 rounded-md border border-[#2b2b30] shadow-sm">
                                    <span className="text-[9px] font-bold text-indigo-400">GROUP</span>
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className={`text-base font-bold truncate transition-colors ${isSelected ? 'text-indigo-400' : 'text-white group-hover:text-indigo-300'}`}>
                                            {recipient?.global_name || recipient?.username || 'Unknown User'}
                                        </h3>
                                        {/* Badges */}
                                        <div className="flex items-center gap-1">
                                            {getBadges(recipient?.public_flags, recipient?.premium_type, recipient?.premium_since).map((badge, idx) => (
                                                <div key={idx} className="group/badge relative">
                                                    <img src={badge.image} alt={badge.name} className="w-5 h-5 object-contain" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <span className="">@{recipient?.username || 'unknown'}</span>
                                        <span className="w-0.5 h-0.5 rounded-full bg-[#2b2b30]" />
                                        <span className="font-mono text-[10px] opacity-60">ID: {dm.id}</span>
                                    </div>
                                </div>
                                {/* View Messages Button */}
                                <div className="hidden sm:flex flex-col items-end justify-center pl-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onOpenChat(dm)
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 border border-indigo-600/30 hover:bg-indigo-600/20 hover:border-indigo-600/50 transition-all group/btn"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400 group-hover/btn:text-indigo-300" />
                                        <span className="text-xs font-bold text-indigo-400 group-hover/btn:text-indigo-300 whitespace-nowrap">View Messages</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Arrow Indicator */}
                        <div className={`pr-2 text-slate-600 transition-all transform ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}
