import { motion, AnimatePresence } from 'framer-motion'
import { Users, X, Search, MessageSquare } from 'lucide-react'
import type { Friend } from '../../types'

interface FriendsModalProps {
    show: boolean
    friends: Friend[]
    searchQuery: string
    onSearchChange: (query: string) => void
    onOpenChat: (friend: Friend) => void
    onClose: () => void
}

export default function FriendsModal({ show, friends, searchQuery, onSearchChange, onOpenChat, onClose }: FriendsModalProps) {
    const filteredFriends = friends.filter(f => {
        if (!searchQuery) return true
        return f.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.user.global_name?.toLowerCase().includes(searchQuery.toLowerCase())
    })

    return (
        <AnimatePresence>
            {show && (
                <div
                    className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#16161a] w-full max-w-2xl rounded-2xl border border-[#232328] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
                    >
                        {/* Modal Header */}
                        <div className="p-5 border-b border-[#232328] flex items-center justify-between bg-[#0e0e10]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Friends List</h2>
                                    <p className="text-xs font-medium text-slate-500">{friends.length} Friends found</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg hover:bg-[#232328] flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="p-4 border-b border-[#232328] bg-[#1a1a1e]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search friends..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="w-full bg-[#0e0e10] border border-[#232328] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Friends List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                            {filteredFriends.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {filteredFriends.map((friend) => (
                                        <div
                                            key={friend.id}
                                            onClick={() => onOpenChat(friend)}
                                            className="p-3 rounded-xl bg-[#0e0e10] border border-[#232328] hover:border-[#2f3136] hover:bg-[#1a1a1e] transition-all group flex items-center gap-3 cursor-pointer"
                                        >
                                            <div className="relative flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-[#232328] overflow-hidden">
                                                    {friend.user.avatar ? (
                                                        <img
                                                            src={`https://cdn.discordapp.com/avatars/${friend.user.id}/${friend.user.avatar}.png`}
                                                            alt={friend.user.username}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                                            {friend.user.username[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#16161a] rounded-full"></div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-white text-sm truncate group-hover:text-indigo-400 transition-colors">
                                                    {friend.user.global_name || friend.user.username}
                                                </h4>
                                                <div className="text-xs text-slate-500 truncate font-medium">@{friend.user.username}</div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    onOpenChat(friend)
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-[#232328] rounded-lg text-slate-400 hover:text-white transition-all"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                                    <Users className="w-10 h-10 mb-3 opacity-20" />
                                    <p className="text-sm font-medium">No friends found</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-[#232328] bg-[#0e0e10] text-center">
                            <p className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                                Displaying {filteredFriends.length} of {friends.length} Friends
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
